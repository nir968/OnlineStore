const User = require('../models/user');

const createUser = async (email, password, type, firstName, lastName, streetAddress, city) => {
    const user = new User({
        email : email,
        password : password,
        type : type,
        firstName : firstName,
        lastName : lastName,
        streetAddress : streetAddress,
        city : city,
    });

    return await user.save();
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const getUsers = async () => {
    return await User.find({});
};

const updateUser = async (id, email, password, type, firstName, lastName, streetAddress, city) => {
    const user = await getUserById(id);
     if (!user)
        return null;

        user.email = email;
        user.password = password;
        user.type = type;
        user.firstName = firstName;
        user.lastName = lastName;
        user.streetAddress = streetAddress;
        user.city = city;

    await user.save();
    return user;
};

const deleteUser = async (id) => {
    const user = await getUserById(id);
    if (!user)
        return null;

    await user.remove();
    return user;
};

module.exports = {
    createUser,
    getUserById,
    getUsers,
    updateUser,
    deleteUser
}