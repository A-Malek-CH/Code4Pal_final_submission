import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import logging
import json
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional

class AutomatedAIMatcher:
    def __init__(self):
        self.skill_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        self.scaler = StandardScaler()
        self.user_reliability = {}  
        self.match_history = []     
        self.learning_enabled = True
        
        # Gaza location coordinates
        self.gaza_locations = {
            'gaza_city': (31.5017, 34.4668),
            'khan_yunis': (31.3489, 34.3063),
            'rafah': (31.2889, 34.2417),
            'deir_al_balah': (31.4181, 34.3511),
            'jabalya': (31.5314, 34.4833),
            'beit_lahia': (31.5469, 34.5069),
            'beit_hanoun': (31.5394, 34.5361),
            'gaza_center': (31.5017, 34.4668)
        }
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def auto_detect_urgency(self, request_text: str, title: str = "") -> str:
        text = f"{title} {request_text}".lower()
        
        critical_keywords = ['emergency', 'urgent', 'critical', 'dying', 'life threatening', 'asap', 'now']
        high_keywords = ['soon', 'quickly', 'fast', 'today', 'immediate']
        low_keywords = ['when possible', 'eventually', 'sometime', 'no rush']
        
        if any(word in text for word in critical_keywords):
            return 'critical'
        elif any(word in text for word in high_keywords):
            return 'high'
        elif any(word in text for word in low_keywords):
            return 'low'
        else:
            return 'medium'

    def auto_extract_skills(self, request_text: str, title: str = "") -> str:
        text = f"{title} {request_text}".lower()
        
        skill_mapping = {
            'medical': ['doctor', 'medicine', 'health', 'sick', 'injury', 'hospital', 'treatment'],
            'food': ['hungry', 'eat', 'meal', 'cooking', 'nutrition', 'bread'],
            'transport': ['ride', 'car', 'transport', 'move', 'delivery', 'vehicle'],
            'shelter': ['house', 'home', 'shelter', 'roof', 'building'],
            'education': ['school', 'teach', 'learn', 'student', 'book'],
            'tech': ['computer', 'internet', 'phone', 'repair', 'technical'],
            'legal': ['law', 'legal', 'document', 'paperwork', 'rights'],
            'childcare': ['baby', 'child', 'kid', 'childcare', 'children']
        }
        
        detected_skills = []
        for skill, keywords in skill_mapping.items():
            if any(keyword in text for keyword in keywords):
                detected_skills.append(skill)
        
        return ' '.join(detected_skills) if detected_skills else 'general_help'

    def auto_calculate_location_distance(self, loc1: str, loc2: str) -> float:
        coords1 = self.gaza_locations.get(loc1.lower().replace(' ', '_'), self.gaza_locations['gaza_center'])
        coords2 = self.gaza_locations.get(loc2.lower().replace(' ', '_'), self.gaza_locations['gaza_center'])
        
        distance = np.sqrt((coords1[0] - coords2[0])**2 + (coords1[1] - coords2[1])**2)
        max_distance = 0.5
        similarity = max(0, 1 - (distance / max_distance))
        
        return similarity

    def auto_get_user_reliability(self, user_id: int) -> float:
        if user_id not in self.user_reliability:
            self.user_reliability[user_id] = 0.7
        
        return self.user_reliability[user_id]

    def auto_update_reliability(self, user_id: int, successful: bool, response_time_hours: float = None):
        current_score = self.auto_get_user_reliability(user_id)
        
        if successful:
            new_score = min(1.0, current_score + 0.05)
        else:
            new_score = max(0.1, current_score - 0.1)
        
        if response_time_hours is not None:
            if response_time_hours < 2:  
                new_score = min(1.0, new_score + 0.02)
            elif response_time_hours > 24:  
                new_score = max(0.1, new_score - 0.02)
        
        self.user_reliability[user_id] = new_score
        self.logger.info(f"Auto-updated reliability for user {user_id}: {current_score:.3f} -> {new_score:.3f}")

    def auto_match(self, request_data: Dict, available_users: List[Dict]) -> List[Tuple[int, float, Dict]]:
        if not available_users:
            return []
        
        urgency = self.auto_detect_urgency(
            request_data.get('description', ''), 
            request_data.get('title', '')
        )
        needed_skills = self.auto_extract_skills(
            request_data.get('description', ''), 
            request_data.get('title', '')
        )
        
        seeker_location = request_data.get('location', 'gaza_center')
        urgency_weight = {'critical': 2.0, 'high': 1.5, 'medium': 1.0, 'low': 0.7}.get(urgency, 1.0)
        
        matches = []
        
        all_skills = [needed_skills] + [user.get('skills', '') for user in available_users]
        
        try:
            skill_features = self.skill_vectorizer.fit_transform(all_skills)
            needed_skills_vector = skill_features[0]
            user_skill_vectors = skill_features[1:]
            
            skill_similarities = cosine_similarity(needed_skills_vector, user_skill_vectors)[0]
            
            for i, user in enumerate(available_users):
                user_id = user.get('id', i)
                
                skill_score = skill_similarities[i] * 0.4
                
                location_score = self.auto_calculate_location_distance(
                    seeker_location, user.get('location', 'gaza_center')
                ) * 0.3
                
                reliability_score = self.auto_get_user_reliability(user_id) * 0.2
                
                avg_response = user.get('avg_response_time', 12)
                response_score = max(0, (24 - avg_response) / 24) * 0.1
                
                total_score = (skill_score + location_score + reliability_score + response_score) * urgency_weight
                
                explanation = {
                    'urgency_detected': urgency,
                    'skills_needed': needed_skills,
                    'skill_match': f"{skill_similarities[i]:.2f}",
                    'location_match': f"{location_score/0.3:.2f}",
                    'user_reliability': f"{self.auto_get_user_reliability(user_id):.2f}",
                    'total_score': f"{total_score:.3f}"
                }
                
                matches.append((user_id, total_score, explanation))
                
        except Exception as e:
            self.logger.error(f"Auto-matching error: {e}")
            for i, user in enumerate(available_users):
                user_id = user.get('id', i)
                location_score = self.auto_calculate_location_distance(
                    seeker_location, user.get('location', 'gaza_center')
                )
                reliability_score = self.auto_get_user_reliability(user_id)
                total_score = (location_score * 0.7 + reliability_score * 0.3) * urgency_weight
                
                explanation = {
                    'urgency_detected': urgency,
                    'simple_match': True,
                    'location_score': f"{location_score:.2f}",
                    'reliability_score': f"{reliability_score:.2f}",
                    'total_score': f"{total_score:.3f}"
                }
                
                matches.append((user_id, total_score, explanation))
        
        matches.sort(key=lambda x: x[1], reverse=True)
        
        self.match_history.append({
            'timestamp': datetime.now().isoformat(),
            'request_id': request_data.get('id'),
            'matches_found': len(matches),
            'top_score': matches[0][1] if matches else 0,
            'urgency': urgency
        })
        
        return matches[:5]  
    def auto_process_request(self, request_data: Dict, available_users: List[Dict]) -> Dict:
        """Main auto-processing function that handles everything automatically"""
        try:
            matches = self.auto_match(request_data, available_users)
            
            if not matches:
                return {
                    'success': False,
                    'message': 'No suitable helpers found',
                    'matches': []
                }
            
            formatted_matches = []
            for user_id, score, explanation in matches:
                user = next((u for u in available_users if u.get('id') == user_id), None)
                if user:
                    formatted_matches.append({
                        'user_id': user_id,
                        'user_name': user.get('name', 'Unknown'),
                        'match_score': round(score, 3),
                        'location': user.get('location'),
                        'skills': user.get('skills'),
                        'reliability': f"{self.auto_get_user_reliability(user_id):.0%}",
                        'explanation': explanation
                    })
            
            return {
                'success': True,
                'request_id': request_data.get('id'),
                'urgency_detected': matches[0][2].get('urgency_detected'),
                'matches': formatted_matches,
                'auto_processed_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Auto-processing failed: {e}")
            return {
                'success': False,
                'message': f'Processing error: {str(e)}',
                'matches': []
            }

    def auto_learn_from_outcome(self, match_result: Dict):
        """Auto-learn from match outcomes to improve future matching"""
        try:
            user_id = match_result.get('helper_user_id')
            successful = match_result.get('successful', False)
            response_time = match_result.get('response_time_hours')
            
            if user_id:
                self.auto_update_reliability(user_id, successful, response_time)
                
                if self.learning_enabled:
                    learning_data = {
                        'timestamp': datetime.now().isoformat(),
                        'user_id': user_id,
                        'successful': successful,
                        'response_time': response_time,
                        'old_reliability': self.user_reliability.get(user_id, 0.7)
                    }
                    
                    self.logger.info(f"Auto-learned from outcome: {learning_data}")
                    
        except Exception as e:
            self.logger.error(f"Auto-learning failed: {e}")

automated_matcher = AutomatedAIMatcher()