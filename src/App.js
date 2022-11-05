import {Route, Routes, useNavigate} from 'react-router-dom';
import Login from './container/Login';
import Home from './container/Home';
import { useEffect, useState } from 'react';
import { userAccessToken, fetchUser } from './utils/fetchUser';

function App() {
  const [user, setuser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = userAccessToken();
    if(!accessToken) {
      navigate('/login', {replace: true});
    } else {
      const [userInfo] = fetchUser();
      setuser(userInfo);
    }
  }, [])
  

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home user={user}/>} />
    </Routes>
  );
}

export default App;
