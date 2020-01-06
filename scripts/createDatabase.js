
// db.createCollection("posts");
db.createCollection("users");
db.createCollection("usergroups");
db.createCollection("roles");

db.createUser({
    user: "mean-enterprise-starter",
    pwd: "12345678",
    roles: [
        {role: "readWrite", db: "mean-enterprise-starter"},
        {role: "dbOwner", db: "mean-enterprise-starter"}
    ]
});
