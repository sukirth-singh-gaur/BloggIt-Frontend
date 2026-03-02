import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUp, useUser } from '@clerk/clerk-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex justify-center items-center mt-10 p-8">
      <SignUp routing="path" path="/register" signInUrl="/login" />
    </div>
  );
};

export default RegisterPage;