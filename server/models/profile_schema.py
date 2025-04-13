from mongoengine import Document, StringField, EmailField, ListField, EmbeddedDocument, EmbeddedDocumentField, BooleanField, DateTimeField
import datetime

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
    dateOfBirth = DateTimeField()
    address = EmbeddedDocumentField(Address)
    resume = StringField()

# Academic Sub-Schema
class Academic(EmbeddedDocument):
    institution = StringField()
    degree = StringField()
    fieldOfStudy = StringField()
    startDate = DateTimeField()
    endDate = DateTimeField()
    description = StringField()
    grade = StringField()

# Project Sub-Schema
class Project(EmbeddedDocument):
    title = StringField()
    description = StringField()
    startDate = DateTimeField()
    endDate = DateTimeField()
    technologiesUsed = ListField(StringField())
    projectLink = StringField()
    isOpenSource = BooleanField()

# Work Experience Sub-Schema
class WorkExperience(EmbeddedDocument):
    company = StringField()
    position = StringField()
    startDate = DateTimeField()
    endDate = DateTimeField()
    description = StringField()
    isCurrent = BooleanField()

# Certification Sub-Schema
class Certification(EmbeddedDocument):
    name = StringField()
    issuingOrganization = StringField()
    issueDate = DateTimeField()
    expirationDate = DateTimeField()
    credentialId = StringField()
    credentialURL = StringField()

# Achievement Sub-Schema
class Achievement(EmbeddedDocument):
    title = StringField()
    description = StringField()
    date = DateTimeField()
    issuer = StringField()

# Publication Sub-Schema
class Publication(EmbeddedDocument):
    title = StringField()
    publisher = StringField()
    publicationDate = DateTimeField()
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
    password = StringField(required=True)  # Consider hashing before storing

    personalInfo = EmbeddedDocumentField(PersonalInfo)
    academic = ListField(EmbeddedDocumentField(Academic))
    projects = ListField(EmbeddedDocumentField(Project))
    skills = ListField(StringField())
    workEx = ListField(EmbeddedDocumentField(WorkExperience))
    certifications = ListField(EmbeddedDocumentField(Certification))
    achievements = ListField(EmbeddedDocumentField(Achievement))
    publications = ListField(EmbeddedDocumentField(Publication))
    socials = EmbeddedDocumentField(Social)
