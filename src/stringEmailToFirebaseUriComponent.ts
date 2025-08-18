const stringEmailToFirebaseUriComponent = (email: string) =>
  email.replace(/\./g, '__')

export default stringEmailToFirebaseUriComponent
