from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
try:
    from .db_integrated_matcher import db_matcher
except ImportError:
    from db_integrated_matcher import db_matcher
    import logging

matcher_bp = Blueprint('matcher', __name__, url_prefix='/api/matching')

@matcher_bp.route('/find-matches', methods=['POST'])
@login_required
def find_matches():
    """
    Automatically find matches for the current user's request
    POST /api/matching/find-matches
    
    JSON Body:
    {
        "title": "Need medical help",
        "description": "My child is sick and needs urgent care",
        "location": "gaza_city"  // optional, uses user's location if not provided
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Get request details
        title = data.get('title', '')
        description = data.get('description', '')
        location = data.get('location') or current_user.localization or 'gaza_center'
        
        if not description:
            return jsonify({
                'success': False,
                'message': 'Request description is required'
            }), 400
        
        # Create request data
        request_data = {
            'id': f'request_{current_user.id}_{data.get("timestamp", "")}',
            'title': title,
            'description': description,
            'location': location,
            'user_id': current_user.id
        }
        
        result = db_matcher.find_matches_for_request_from_db(request_data, current_user.id)
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Error in find_matches: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@matcher_bp.route('/find-matches-for-user/<int:user_id>', methods=['POST'])
@login_required
def find_matches_for_user(user_id):
    """
    Find matches for a specific user (admin/helper function)
    POST /api/matching/find-matches-for-user/123
    
    JSON Body:
    {
        "request_title": "Help needed",
        "request_description": "Looking for assistance"
    }
    """
    try:
        data = request.get_json() or {}
        
        title = data.get('request_title', '')
        description = data.get('request_description', '')
        
        result = db_matcher.find_matches_by_user_id(user_id, description, title)
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Error in find_matches_for_user: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@matcher_bp.route('/record-outcome', methods=['POST'])
@login_required
def record_match_outcome():
    """
    Record the outcome of a match for AI learning
    POST /api/matching/record-outcome
    
    JSON Body:
    {
        "helper_user_id": 123,
        "successful": true,
        "response_time_hours": 2.5
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        helper_user_id = data.get('helper_user_id')
        successful = data.get('successful', False)
        response_time = data.get('response_time_hours')
        
        if not helper_user_id:
            return jsonify({
                'success': False,
                'message': 'helper_user_id is required'
            }), 400
        
        # Save outcome and let AI learn
        success = db_matcher.save_match_outcome_to_db(helper_user_id, successful, response_time)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Match outcome recorded successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to record match outcome'
            }), 500
        
    except Exception as e:
        current_app.logger.error(f"Error in record_match_outcome: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@matcher_bp.route('/user-stats/<int:user_id>', methods=['GET'])
@login_required
def get_user_stats(user_id):
    """
    Get AI-calculated statistics for a user
    GET /api/matching/user-stats/123
    """
    try:
        stats = db_matcher.get_user_stats(user_id)
        
        if 'error' in stats:
            return jsonify({
                'success': False,
                'message': stats['error']
            }), 404
        
        return jsonify({
            'success': True,
            'stats': stats
        })
        
    except Exception as e:
        current_app.logger.error(f"Error in get_user_stats: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@matcher_bp.route('/search-helpers', methods=['GET'])
@login_required
def search_helpers():
    """
    Search for helpers with specific skills
    GET /api/matching/search-helpers?skill=medical&location=gaza_city
    """
    try:
        skill = request.args.get('skill', '').strip()
        location = request.args.get('location', '').strip()
        
        if not skill:
            return jsonify({
                'success': False,
                'message': 'Skill parameter is required'
            }), 400
        
        helpers = db_matcher.search_helpers_by_skill(skill, location)
        
        return jsonify({
            'success': True,
            'skill_searched': skill,
            'location_filter': location or 'all',
            'helpers_found': len(helpers),
            'helpers': helpers
        })
        
    except Exception as e:
        current_app.logger.error(f"Error in search_helpers: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@matcher_bp.route('/my-reliability', methods=['GET'])
#@login_required
def get_my_reliability():
    """
    Get current user's AI-calculated reliability score
    GET /api/matching/my-reliability
    """
    try:
        reliability = db_matcher.auto_get_user_reliability(current_user.id)
        
        return jsonify({
            'success': True,
            'user_id': current_user.id,
            'username': current_user.username,
            'reliability_score': reliability,
            'reliability_percentage': f"{reliability:.0%}",
            'reliability_level': (
                'Excellent' if reliability >= 0.9 else
                'Very Good' if reliability >= 0.8 else
                'Good' if reliability >= 0.7 else
                'Fair' if reliability >= 0.6 else
                'Needs Improvement'
            )
        })
        
    except Exception as e:
        current_app.logger.error(f"Error in get_my_reliability: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

# Auto-trigger route for when requests are created
@matcher_bp.route('/auto-process-request', methods=['POST'])
def auto_process_new_request():
    """
    Automatically process a new request (called internally when requests are created)
    This can be called from your request creation logic
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No request data provided'
            }), 400
        
        # Extract request information
        request_id = data.get('request_id')
        title = data.get('title', '')
        description = data.get('description', '')
        location = data.get('location', 'gaza_center')
        requesting_user_id = data.get('user_id')
        
        if not all([request_id, description, requesting_user_id]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields: request_id, description, user_id'
            }), 400
        
        # Create request data for AI processing
        request_data = {
            'id': request_id,
            'title': title,
            'description': description,
            'location': location,
            'user_id': requesting_user_id
        }
        
        # Automatically find matches
        result = db_matcher.find_matches_for_request_from_db(request_data, requesting_user_id)
        
        
        return jsonify(result)
        
    except Exception as e:
        current_app.logger.error(f"Error in auto_process_new_request: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

# Register the blueprint in your main app
def register_matcher_routes(app):
    """Register the matcher blueprint with the Flask app"""
    app.register_blueprint(matcher_bp)