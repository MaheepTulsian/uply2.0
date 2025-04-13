from fastapi import APIRouter

# Import individual route modules
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

from routes.auth.register import router as register_router
from routes.auth.login import router as login_router

# Create a global router
router = APIRouter()

# Include all routers
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

router.include_router(register_router, prefix="/auth", tags=["Auth"])
router.include_router(login_router, prefix="/auth", tags=["Auth"])
