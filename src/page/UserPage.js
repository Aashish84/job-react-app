import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

export default function UserPage() {
  const [user, setUser] = useState({});
  const [profileImg, setProfileImg] = useState(null);
  const inputRef = useRef(null);

  async function getUser() {
    try {
      const access_token = localStorage.getItem("access_token");
      const { data } = await axios(
        `${process.env.REACT_APP_SERVER_URL}/get-user`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  function handleProfileImgChange(e) {
    setProfileImg(e.target.files[0]);
  }

  function clickImg(e) {
    e.preventDefault();
    inputRef.current.click();
    if (!profileImg) {
      return;
    }
  }

  async function changeProfileImg(e) {
    try {
      const form_data = new FormData();
      form_data.append("profileimg", profileImg);
      const access_token = localStorage.getItem("access_token");
      const { data } = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/user/profileimg`,
        form_data,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      getUser();
      inputRef.current.value = null;
      setProfileImg(null);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    changeProfileImg();
    // eslint-disable-next-line
  }, [profileImg]);

  return (
    <>
      <div className="page-content page-container" id="page-content">
        <div className="padding">
          <div className="row d-flex justify-content-center">
            <div className="col-xl-6 col-md-12">
              <div className="card user-card-full">
                <div className="row m-l-0 m-r-0">
                  <div className="col-sm-4 bg-c-lite-green user-profile">
                    <div className="card-block text-center text-white">
                      <div className="m-b-25">
                        {user.profileImg ? (
                          <img
                            src={`${process.env.REACT_APP_SERVER_URL}/user_file/${user.profileImg}`}
                            className="img-radius"
                            alt="hlo"
                            style={{ width: "100px", height: "100px" }}
                          />
                        ) : (
                          <img
                            src="https://img.icons8.com/bubbles/100/000000/user.png"
                            className="img-radius"
                            alt="UserProfileImage"
                          />
                        )}
                      </div>
                      <h6 className="f-w-600">{user.name}</h6>

                      <input
                        type="file"
                        name="profileimg"
                        onChange={handleProfileImgChange}
                        ref={inputRef}
                        style={{ display: "none" }}
                      />
                      <button type="submit" onClick={clickImg}>
                        {user.profileImg ? "update image" : "upload profile"}
                      </button>

                      <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="card-block">
                      <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                        Information
                      </h6>
                      <div className="row">
                        <div className="col-sm-6 mt-2 mb-2">
                          <p className="m-b-10 f-w-600">Email</p>
                          <h6 className="text-muted f-w-400">{user.email}</h6>
                        </div>
                        <div className="col-sm-6 mt-2 mb-2">
                          <p className="m-b-10 f-w-600">Role</p>
                          <h6 className="text-muted f-w-400">{user.role}</h6>
                        </div>
                        {user.file && (
                          <div className="col-sm-6 mt-2 mb-2">
                            <p className="m-b-10 f-w-600">CV</p>
                            <h6 className="text-muted f-w-400">
                              <a
                                href={`${process.env.REACT_APP_SERVER_URL}/user_file/${user.file}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                view cv
                              </a>
                            </h6>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
