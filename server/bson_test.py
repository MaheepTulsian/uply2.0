from bson import ObjectId

obj_id = ObjectId()
print("Generated ObjectId:", obj_id)

# import os
# import subprocess
# import sys
# import site

# # Step 1: Uninstall rogue bson package
# subprocess.call([sys.executable, "-m", "pip", "uninstall", "-y", "bson"])

# # Step 2: Force reinstall pymongo to restore proper bson
# subprocess.call([sys.executable, "-m", "pip", "install", "--force-reinstall", "pymongo"])

# # Step 3: Check if bson is now loading from pymongo's internal package
# try:
#     import bson
#     print("✅ bson loaded from:", bson.__file__)
# except ImportError as e:
#     print("❌ Failed to import bson:", e)
