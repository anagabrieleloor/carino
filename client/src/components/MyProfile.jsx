import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../API";
import EditProfile from "./EditProfile";
import ReplyMessage from "./ReplyMessage";
import NewMessage from "./NewMessage";

export default function UserProfile({token, user_id}) {
  // const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  // Function to open the pop-up
  function openForm() {
    console.log("Opening the pop-up");
    setIsEditFormVisible(true);
  }

  // Function to close the pop-up
  function closeForm() {
    setIsEditFormVisible(false);
  }

  useEffect(() => {
    async function getSingleUser() {
      try {
        const APIResponse = await fetchUserProfile(user_id, token);
        if (APIResponse) {
          setUser(APIResponse);
          // console.log('profile:', user.first_name);
        } else {
          setError("Failed to fetch user profile");
        }
      } catch (err) {
        console.error(err);
        setError("♡");
      }
    }
    getSingleUser();
  }, [user_id, token]);

  const handleCloseClick = () => {
    setIsEditFormVisible(false);
  };

  return (
    <div className="container">
     
      {/* hello, {user.first_name} */}
      hello, qt
      
      
      {/* {user ? <EditProfile user={user} /> : null} */}
      {error && <p>{error}</p>}
      {user && (
        <div className="card">
          
          {console.log('Profile: ', user.first_name)}
                  <img src={user.photos} alt={`${user.first_name}'s Profile`} id="user-profile-image" />
        <p className="card__name">{user.first_name}</p>
        <div className="grid-container">
          <div className="grid-child-posts">
            <p>age: {user.age}</p>
          </div>
          <div className="grid-child-followers">
            <p>location: {user.location}</p><br />
          </div>
        
        </div>
        <ul className="social-icons">
          <li><a href="#"><i className="fa fa-instagram"></i></a></li>
          <li><a href="#"><i className="fa fa-twitter"></i></a></li>
          <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
          <li><a href="#"><i className="fa fa-codepen"></i></a></li>
        </ul>
        {/* <button className="btn draw-border" onClick={() => navigate(`/users/edit_profile/:user_id`)}>edit</button> */}

        {isEditFormVisible && (
  <div className={`form-popup ${isEditFormVisible ? 'visible' : ''}`} id="myForm">
    {user ? <EditProfile user_id={user_id} token={token} setIsEditFormVisible={setIsEditFormVisible}/> : null}
  </div>
)}
        <button className="btn draw-border" onClick={openForm}>edit</button>
        {/* <div className="form-popup" id="myForm">
        {user ? <EditProfile user={user} /> : null}
          </div> */}

        <button className="btn draw-border">delete</button>
       
     
        </div>
        
      )}
    </div>
    
  );
}

