
db.contacts.insert({
    "_id" : contactId_1,

    "firstName": "Julia",
    "middleName": "",
    "lastName": "Aplízar",
    "salutation": "Srta.",
    "gender": "2",
    "maritalStatus": "1",
    "dateOfBirth": "29/7/1986",
    "countryOfBirth": "CRI",

    "corporateName": "",
    "dateOfConstitution": "",
    "countryOfConstitution": "",

    "contactType": "1",
    "alias": "",
    "homePhoneNumber": "123 456 789",
    "mobilePhoneNumber": "123 456 789",
    "workPhoneNumber": "123 456 789",
    "email": "test@test.com",
    "identifications": [
        {
            "idType": "1",
            "idNumber": "123456789",
            "expirationDate": "10/5/2021",
            "expeditedBy": "Gobierno de Costa Rica",
            "isMainId": true
        }
    ],
    "addresses": [
        {
            "street" : "123 Main St.",
            "city" : "San Pedro",
            "state" : "San Jose",
            "country" : "CRI",
            "postalCode" : 11501
        }
    ],
    "profession": "Economista",
    "jobPosition": "Consultora",

    "deleted": false,
    "createdAt": ISODate("2020-01-30T20:10:00.356Z"),
    "updatedAt": ISODate("2020-01-30T20:10:00.356Z")
});

db.contacts.insert({
    "_id" : contactId_2,

    "firstName": "",
    "middleName": "",
    "lastName": "",
    "salutation": "",
    "gender": "",
    "maritalStatus": "",
    "dateOfBirth": "",
    "countryOfBirth": "",

    "corporateName": "Pollolandia",
    "dateOfConstitution": "29/7/1986",
    "countryOfConstitution": "CRI",

    "contactType": "2",
    "alias": "",
    "homePhoneNumber": "123 456 789",
    "mobilePhoneNumber": "123 456 789",
    "workPhoneNumber": "123 456 789",
    "email": "test@test.com",
    "identifications": [
        {
            "idType": "1",
            "idNumber": "123456789",
            "expirationDate": "10/5/2021",
            "expeditedBy": "Gobierno de Costa Rica",
            "isMainId": true
        }
    ],
    "addresses": [
        {
            "street" : "123 Main St.",
            "city" : "San Pedro",
            "state" : "San Jose",
            "country" : "CRI",
            "postalCode" : 11501
        }
    ],
    "profession": "Economista",
    "jobPosition": "Consultora",

    "deleted": false,
    "createdAt": ISODate("2020-01-30T20:10:00.356Z"),
    "updatedAt": ISODate("2020-01-30T20:10:00.356Z")
});
