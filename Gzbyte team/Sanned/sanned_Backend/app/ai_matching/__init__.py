
try:
    from .automated_ai_matcher import AutomatedAIMatcher, automated_matcher
    from .db_integrated_matcher import DatabaseIntegratedMatcher, db_matcher
    from .matcher_routes import matcher_bp, register_matcher_routes
    
    __version__ = "1.0.0"
    __author__ = "Gaza Community Helper Network"
    
    __all__ = [
        'AutomatedAIMatcher',
        'automated_matcher', 
        'DatabaseIntegratedMatcher',
        'db_matcher',
        'matcher_bp',
        'register_matcher_routes'
    ]
    
    def get_matcher():
        return db_matcher
    
    def get_basic_matcher():
        return automated_matcher

except ImportError as e:
    import logging
    logging.warning(f"Some AI matching components could not be imported: {e}")
    
    class FallbackMatcher:
        def find_matches_for_request_from_db(self, request_data, exclude_user_id=None):
            return {
                'success': False,
                'message': 'AI matching system not fully initialized',
                'matches': []
            }
    
    db_matcher = FallbackMatcher()
    
    def get_matcher():
        return db_matcher