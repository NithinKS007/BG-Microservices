export const codeGenerator = () => {
  const randomId = () => {
    return Math.random().toString(16).substring(2, 10) + 
           Math.random().toString(16).substring(2, 10);
  };

  return {
    code: randomId(),
  };
};
