from mongoengine import Document, StringField, EmailField, ListField, EmbeddedDocument, EmbeddedDocumentField, BooleanField

# Address Sub-Schema
class Address(EmbeddedDocument):
    street = StringField()
    city = StringField()
    state = StringField()
    country = StringField()
    zipCode = StringField()

# Personal Info Sub-Schema
class PersonalInfo(EmbeddedDocument):
    firstName = StringField()
    lastName = StringField()
    email = EmailField(unique=True)
    phone = StringField()
    dateOfBirth = StringField()  # YYYY-MM-DD format
    address = EmbeddedDocumentField(Address)
    resume = StringField()

# Academic Sub-Schema
class Academic(EmbeddedDocument):
    institution = StringField()
    degree = StringField()
    fieldOfStudy = StringField()
    startDate = StringField()  # YYYY-MM-DD format
    endDate = StringField()    # YYYY-MM-DD format
    description = StringField()
    grade = StringField()

# Project Sub-Schema
class Project(EmbeddedDocument):
    title = StringField()
    description = StringField()
    startDate = StringField()  # YYYY-MM-DD format
    endDate = StringField()    # YYYY-MM-DD format
    technologiesUsed = ListField(StringField())
    projectLink = StringField()
    isOpenSource = BooleanField()

# Work Experience Sub-Schema
class WorkExperience(EmbeddedDocument):
    company = StringField()
    position = StringField()
    startDate = StringField()  # YYYY-MM-DD format
    endDate = StringField()    # YYYY-MM-DD format
    description = StringField()
    isCurrent = BooleanField()

# Certification Sub-Schema
class Certification(EmbeddedDocument):
    name = StringField()
    issuingOrganization = StringField()
    issueDate = StringField()         # YYYY-MM-DD format
    expirationDate = StringField()    # YYYY-MM-DD format
    credentialId = StringField()
    credentialURL = StringField()

# Achievement Sub-Schema
class Achievement(EmbeddedDocument):
    title = StringField()
    description = StringField()
    date = StringField()  # YYYY-MM-DD format
    issuer = StringField()

# Publication Sub-Schema
class Publication(EmbeddedDocument):
    title = StringField()
    publisher = StringField()
    publicationDate = StringField()  # YYYY-MM-DD format
    description = StringField()
    link = StringField()

# Social Links Sub-Schema
class Social(EmbeddedDocument):
    linkedIn = StringField()
    github = StringField()
    twitter = StringField()
    website = StringField()
    medium = StringField()
    stackOverflow = StringField()
    leetcode = StringField()

# Main Profile Schema
class Profile(Document):
    username = StringField(required=True, unique=True)
    password = StringField()  # Can be empty for Firebase auth users
    firebase_uid = StringField(sparse=True, unique=True)  # Firebase User ID
    
    personalInfo = EmbeddedDocumentField(PersonalInfo)
    academic = ListField(EmbeddedDocumentField(Academic))
    projects = ListField(EmbeddedDocumentField(Project))
    skills = ListField(StringField())
    workEx = ListField(EmbeddedDocumentField(WorkExperience))
    certifications = ListField(EmbeddedDocumentField(Certification))
    achievements = ListField(EmbeddedDocumentField(Achievement))
    publications = ListField(EmbeddedDocumentField(Publication))
    socials = EmbeddedDocumentField(Social)
    
    meta = {
        'collection': 'profiles',  # Explicitly naming the collection
        'indexes': [
            'username',  # Index for faster username lookups
            'firebase_uid',  # Index for faster Firebase UID lookups
            {'fields': ['personalInfo.email'], 'unique': True, 'sparse': True}  # Ensure email uniqueness when provided
        ]
    }