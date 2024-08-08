const { bcrypt, prisma } = require("../shared");

const adminUpdateUserById = async (
  id,
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  isAdmin
) => {
  const hashPassword = await bcrypt.hash(password, 10);
  return await prisma.users.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      password: hashPassword,
      phoneNumber,
      isAdmin,
    },
  });
};

const getAllUsers = async () => {
  return await prisma.users.findMany();
};

const deleteUserById = async (id) => {
  return await prisma.users.delete({
    where: { id },
  });
};

module.exports = {
  getAllUsers,
  deleteUserById,
  adminUpdateUserById,
};
