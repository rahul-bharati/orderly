export const invalidRegisterPayload = {
  firstName: "John",
  email: "invalid-email",
  password: "password",
  confirmPassword: 'password1'
}

export const validRegisterPayload = {
  firstName: "John",
  email: "testemail@test.com",
  password: "Password123!",
  confirmPassword: 'Password123!'
}

export const invalidLoginPayload = {
  email: "testemail@test.com",
  password: "obviously-wrong-password"
}

export const validLoginPayload = {
  email: "testemail@test.com",
  password: "Password123!"
}
