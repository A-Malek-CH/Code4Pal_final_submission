from schema import Schema, And, Optional, SchemaError
import re

class SchemaValidator:
    @staticmethod
    def validate_user(data):
        schema = Schema({
            'email': And(str, lambda s: '@' in s and len(s) <= 150, error="Invalid email"),
            'password': And(str, lambda s: len(s) >= 6, error="Password must be at least 6 characters"),
            'role': And(str, lambda s: s in ['sponsor', 'seeker', 'doer'], error="Invalid role"),
            Optional('city'): str,
            Optional('phone'): And(str, lambda s: re.match(r'^\+?\d{9,15}$', s), error="Invalid phone number"),
            Optional('username'): And(str, lambda s: 3 <= len(s) <= 50 and s.isalnum(), error="Username must be 3-50 alphanumeric characters")
        })
        try:
            return schema.validate(data)
        except SchemaError as e:
            raise ValueError(f"Invalid input: {e}")

    @staticmethod
    def validate_username_update(data):
        schema = Schema({
            'username': And(str, lambda s: 3 <= len(s) <= 50 and s.isalnum(), error="Username must be 3-50 alphanumeric characters")
        })
        try:
            return schema.validate(data)
        except SchemaError as e:
            raise ValueError(f"Invalid input: {e}")
    @staticmethod
    def validate_login(data):
        schema = Schema({
            'email': And(str, lambda s: '@' in s and len(s) <= 150, error="Invalid email"),
            'password': And(str, lambda s: len(s) >= 6, error="Password must be at least 6 characters")
        })
        try:
            return schema.validate(data)
        except SchemaError as e:
            raise ValueError(f"Invalid input: {e}")
