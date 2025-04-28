from fastapi import APIRouter

# Import individual route modules
# Profile routes
from routes.profile.get_full_profile import router as get_profile_router
from routes.profile.personal_info import router as personal_info_router
from routes.profile.academic_info import router as academic_info_router
from routes.profile.project_info import router as project_info_router
from routes.profile.skill_info import router as skill_info_router
from routes.profile.workex_info import router as workex_info_router
from routes.profile.certification_info import router as certification_info_router
from routes.profile.achievement_info import router as achievement_info_router
from routes.profile.publication_info import router as publication_info_router
from routes.profile.social_info import router as social_info_router

# Auth routes
from routes.auth.login import router as login_router
from routes.auth.signup import router as signup_router
from routes.auth.google import router as google_auth_router
from routes.auth.logout import router as logout_router

# Create a global router
router = APIRouter()

# Include all profile routers
router.include_router(get_profile_router, prefix="/profile", tags=["Profile"])
router.include_router(personal_info_router, prefix="/profile", tags=["Profile"])
router.include_router(academic_info_router, prefix="/profile", tags=["Profile"])
router.include_router(project_info_router, prefix="/profile", tags=["Profile"])
router.include_router(skill_info_router, prefix="/profile", tags=["Profile"])
router.include_router(workex_info_router, prefix="/profile", tags=["Profile"])
router.include_router(certification_info_router, prefix="/profile", tags=["Profile"])
router.include_router(achievement_info_router, prefix="/profile", tags=["Profile"])
router.include_router(publication_info_router, prefix="/profile", tags=["Profile"])
router.include_router(social_info_router, prefix="/profile", tags=["Profile"])

# Include all auth routers
router.include_router(login_router, prefix="/auth", tags=["Auth"])
router.include_router(signup_router, prefix="/auth", tags=["Auth"])
router.include_router(google_auth_router, prefix="/auth", tags=["Auth"])
router.include_router(logout_router, prefix="/auth", tags=["Auth"])