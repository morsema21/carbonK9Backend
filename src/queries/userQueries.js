const { bcrypt, prisma, jwt } = require("../shared");

const registerQuery = async ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  isAdmin,
  cart,
  dogs,
  requests,
}) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const registerUser = await prisma.users.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashPassword,
      phoneNumber,
      isAdmin,
    },
    include: {
      cart,
      dogs,
      requests,
    },
  });
  const token = jwt.sign(
    {
      id: registerUser.id,
      isAdmin: registerUser.isAdmin,
      cart: registerUser.cart,
      dogs: registerUser.dogs,
      requests: registerUser.requests,
    },
    process.env.WEB_TOKEN
  );
  console.log(registerUser);
  const updatedToken = {
    token,
    id: registerUser.id,
    isAdmin: registerUser.isAdmin,
    cart: registerUser.cart,
    dogs: registerUser.dogs,
    requests: registerUser.requests,
  };
  return updatedToken;
};

const loginUser = async (email, password) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      cart: true,
      dogs: true,
      requests: true,
    },
  });
  console.log(user);

  if (!user) {
    throw new Error("No User Found");
  }
  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new Error("Invalid Credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
      cart: user.cart,
      dogs: user.dogs,
      requests: user.requests,
    },
    process.env.WEB_TOKEN
  );
  const updatedToken = {
    token,
    id: user.id,
    isAdmin: user.isAdmin,
    cart: user.cart,
    dogs: user.dogs,
    requests: user.requests,
  };
  return updatedToken;
};

const updateUserById = async (
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

const getSingleUser = async (id) => {
  return await prisma.users.findUnique({
    where: { id },
  });
};

module.exports = {
  registerQuery,
  loginUser,
  updateUserById,
  getSingleUser,
};
