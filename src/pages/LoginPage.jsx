import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, useUser } from '@clerk/clerk-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex justify-center items-center mt-10 p-8">
      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </div>
  );
};

export default LoginPage;