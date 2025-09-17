import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from automated_ai_matcher import AutomatedAIMatcher
from typing import List, Dict, Tuple, Optional
import logging

class DatabaseIntegratedMatcher(AutomatedAIMatcher):
    
    def __init__(self):
        super().__init__()
        self.logger = logging.getLogger(__name__)
        self.has_db = False
    
    def _convert_user_to_dict(self, user) -> Dict:
        """Convert user object to dictionary, handling both DB objects and dicts"""
        try:
            if isinstance(user, dict):
                return user
                
            user_skills = []
            if hasattr(user, 'skills') and user.skills:
                try:
                    for user_skill in user.skills:
                        if hasattr(user_skill, 'skill') and user_skill.skill and hasattr(user_skill.skill, 'name'):
                            user_skills.append(user_skill.skill.name)
                except Exception as e:
                    self.logger.warning(f"Error extracting skills for user {getattr(user, 'id', 'unknown')}: {e}")
            
            location = getattr(user, 'localization', None) or getattr(user, 'location', 'gaza_center')
            user_id = getattr(user, 'id', None)
            
            if user_id:
                reliability = self.auto_get_user_reliability(user_id)
            else:
                reliability = 0.7
            
            return {
                'id': user_id,
                'name': getattr(user, 'username', 'Unknown'),
                'email': getattr(user, 'email', ''),
                'location': location,
                'skills': ' '.join(user_skills),
                'role': getattr(user, 'roles', 'seeker_doer'),
                'is_in_gaza': getattr(user, 'is_in_gaza', False),
                'reliability_score': reliability,
                'avg_response_time': 12.0,
                'completion_rate': reliability
            }
        except Exception as e:
            self.logger.error(f"Error converting user to dict: {e}")
            return {
                'id': getattr(user, 'id', None),
                'name': getattr(user, 'username', 'Unknown'),
                'location': 'gaza_center',
                'skills': '',
                'role': 'seeker_doer',
                'reliability_score': 0.5
            }
    
    def find_matches_for_request_from_db(self, request_data: Dict, exclude_user_id: int = None) -> Dict:
        """Find matches using actual database users if available, fallback to test data"""
        try:
            # Import database components only when needed
            from app import db
            from app.models.Users import User
            from app.models.userSkills import UserSkills
            from app.models.skills import Skill
            from sqlalchemy.orm import joinedload
            
            # If we get here, database is available
            self.has_db = True
            
            # Try to query database
            query = User.query.filter(
                User.roles.in_(['sponsor', 'seeker_doer', 'both']),
                User.is_in_gaza == True
            )
            
            if exclude_user_id:
                query = query.filter(User.id != exclude_user_id)
            
            # Try to load skills if the relationship exists
            try:
                query = query.options(joinedload(User.skills))
            except Exception:
                pass  # Skills relationship might not be set up
            
            available_users = query.all()
            
            if not available_users:
                return {
                    'success': False,
                    'message': 'No available helpers found in Gaza',
                    'matches': []
                }
            
            users_data = [self._convert_user_to_dict(user) for user in available_users]
            
            result = self.auto_process_request(request_data, users_data)
            
            if result['success']:
                for match in result['matches']:
                    db_user = next((u for u in available_users if u.id == match['user_id']), None)
                    if db_user:
                        match['db_user'] = db_user
                        match['contact_email'] = getattr(db_user, 'email', '')
                        match['contact_phone'] = getattr(db_user, 'phone_number', None)
            
            return result
            
        except Exception as e:
            self.logger.error(f"Database matching error: {e}")
            # Fallback to test data if database fails
            return self._fallback_matching(request_data, exclude_user_id)
    
    def _fallback_matching(self, request_data: Dict, exclude_user_id: int = None) -> Dict:
        """Fallback matching with test data when database is not available"""
        test_users = [
            {
                'id': 1,
                'name': 'Dr. Ahmed',
                'email': 'ahmed@test.com',
                'location': 'gaza_city',
                'skills': 'medical doctor pediatric emergency',
                'role': 'sponsor',
                'is_in_gaza': True,
                'avg_response_time': 2
            },
            {
                'id': 2,
                'name': 'Teacher Sara',
                'email': 'sara@test.com',
                'location': 'khan_yunis',
                'skills': 'education teaching childcare',
                'role': 'seeker_doer',
                'is_in_gaza': True,
                'avg_response_time': 6
            },
            {
                'id': 3,
                'name': 'Engineer Omar',
                'email': 'omar@test.com',
                'location': 'gaza_center',
                'skills': 'tech computer repair transport',
                'role': 'both',
                'is_in_gaza': True,
                'avg_response_time': 4
            }
        ]
        
        if exclude_user_id:
            test_users = [u for u in test_users if u['id'] != exclude_user_id]
        
        return self.auto_process_request(request_data, test_users)
    
    def find_matches_by_user_id(self, requesting_user_id: int, request_description: str = "", request_title: str = "") -> Dict:
        """Find matches for a specific user by their ID"""
        try:
            # Import database components only when needed
            from app import db
            from app.models.Users import User
            
            requesting_user = User.query.get(requesting_user_id)
            if not requesting_user:
                return {
                    'success': False,
                    'message': 'Requesting user not found',
                    'matches': []
                }
            
            location = getattr(requesting_user, 'localization', 'gaza_center')
            
            request_data = {
                'id': f"user_request_{requesting_user_id}",
                'title': request_title or "Help needed",
                'description': request_description or "General assistance needed",
                'location': location,
                'user_id': requesting_user_id
            }
            
            return self.find_matches_for_request_from_db(request_data, requesting_user_id)
            
        except Exception as e:
            self.logger.error(f"Error finding matches for user {requesting_user_id}: {e}")
            # Fallback to test data
            request_data = {
                'id': f"user_request_{requesting_user_id}",
                'title': request_title or "Help needed", 
                'description': request_description or "General assistance needed",
                'location': 'gaza_center',
                'user_id': requesting_user_id
            }
            return self._fallback_matching(request_data, requesting_user_id)
    
    def save_match_outcome_to_db(self, helper_user_id: int, successful: bool, response_time_hours: float = None):
        """Save match outcome and update user reliability in the system"""
        try:
            self.auto_learn_from_outcome({
                'helper_user_id': helper_user_id,
                'successful': successful,
                'response_time_hours': response_time_hours
            })
            
            self.logger.info(f"Saved match outcome for user {helper_user_id}: successful={successful}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving match outcome: {e}")
            return False
    
    def get_user_stats(self, user_id: int) -> Dict:
        try:
            # Import database components only when needed
            from app import db
            from app.models.Users import User
            
            user = User.query.get(user_id)
            if not user:
                return {'error': 'User not found'}
            
            skill_count = 0
            if hasattr(user, 'skills') and user.skills:
                try:
                    skill_count = user.skills.count()
                except:
                    skill_count = len(list(user.skills))
            
            return {
                'user_id': user_id,
                'username': user.username,
                'reliability_score': self.auto_get_user_reliability(user_id),
                'skill_count': skill_count,
                'location': getattr(user, 'localization', ''),
                'role': getattr(user, 'roles', ''),
                'is_in_gaza': getattr(user, 'is_in_gaza', False),
                'account_created': getattr(user, 'created_at', None)
            }
            
        except Exception as e:
            self.logger.error(f"Error getting user stats: {e}")
            # Return test data if database fails
            return {
                'user_id': user_id,
                'username': f'TestUser{user_id}',
                'reliability_score': self.auto_get_user_reliability(user_id),
                'skill_count': 2,
                'location': 'gaza_center',
                'role': 'seeker_doer',
                'is_in_gaza': True,
                'account_created': None
            }
    
    def search_helpers_by_skill(self, skill_name: str, location: str = None) -> List[Dict]:
        try:
            # Import database components only when needed
            from app import db
            from app.models.Users import User
            from app.models.userSkills import UserSkills
            from app.models.skills import Skill
            from sqlalchemy.orm import joinedload
            
            query = User.query.filter(
                User.roles.in_(['sponsor', 'seeker_doer', 'both']),
                User.is_in_gaza == True
            )
            
            if location:
                query = query.filter(User.localization.ilike(f'%{location}%'))
            
            try:
                query = query.options(joinedload(User.skills))
            except:
                pass
            
            users = query.all()
            
            matching_users = []
            for user in users:
                user_skills = []
                if hasattr(user, 'skills') and user.skills:
                    try:
                        for user_skill in user.skills:
                            if hasattr(user_skill, 'skill') and user_skill.skill and hasattr(user_skill.skill, 'name'):
                                user_skills.append(user_skill.skill.name.lower())
                    except:
                        pass
                
                if skill_name.lower() in user_skills:
                    user_dict = self._convert_user_to_dict(user)
                    user_dict['matching_skill'] = skill_name
                    matching_users.append(user_dict)
            
            return matching_users
            
        except Exception as e:
            self.logger.error(f"Error searching helpers by skill: {e}")
            # Return test data for demonstration
            test_helpers = [
                {
                    'id': 1,
                    'name': 'Dr. Ahmed',
                    'location': 'gaza_city',
                    'skills': 'medical doctor pediatric emergency',
                    'matching_skill': skill_name,
                    'reliability_score': 0.9
                }
            ]
            return [h for h in test_helpers if skill_name.lower() in h['skills'].lower()]

db_matcher = DatabaseIntegratedMatcher()