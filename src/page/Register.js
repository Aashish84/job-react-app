import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { setUser } from "../redux/reducer/userSlice";

export default function Register() {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "s@s.com",
    password: "12345678",
    name: "",
    role: "jobseeker",
    avatar: null,
  });

  const [apiError, setAPIError] = useState({
    email: "",
    name: "",
    role: "",
    password: "",
    other: "",
  });

  // check if already login
  if (Object.keys(user).length !== 0) {
    return <Navigate to="/" />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(formData);
    try {
      let form_data = new FormData();
      form_data.append("name", formData.name);
      form_data.append("role", formData.role);
      form_data.append("avatar", formData.avatar);
      form_data.append("email", formData.email);
      form_data.append("password", formData.password);

      let { data: tokenData } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/register`,
        form_data
      );

      // call get-user api
      // get user of provided token (above token)
      const { data: userData } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/get-user`,
        {
          headers: {
            authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      // add user to redux state
      dispatch(setUser(userData));
      localStorage.setItem("access_token", tokenData.token);
      // return to previous route
      return navigate("/");
    } catch (error) {
      //   console.log(error);
      //   console.log(error.response.data, 101);
      const { errors } = error.response.data;
      //   console.log({ errors });
      if (!errors) {
        setAPIError((prev) => {
          return {
            ...prev,
            other: "something went wrong",
          };
        });
        return;
      }
      errors.forEach((el) => {
        setAPIError((prev) => {
          return {
            ...prev,
            [el.param]: el.msg,
          };
        });
      });
    }
  }

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: type === "file" ? files[0] : value,
      };
    });
  }

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#8fc4b7" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-8 col-xl-6">
            <div className="card rounded-3">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img3.webp"
                className="w-100"
                style={{
                  borderTopLeftRadius: ".3rem",
                  borderTopRightRadius: ".3rem",
                }}
                alt="Sample_photo"
              />
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">
                  Registration Info
                </h3>

                <form className="px-md-2" onSubmit={handleSubmit}>
                  <div className="form-outline mb-4">
                    <label
                      className="form-label required-field"
                      htmlFor="form3Example1q"
                    >
                      Email
                      <span className="text-danger mx-2">{apiError.email}</span>
                    </label>
                    <input
                      type="email"
                      id="form3Example1q"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-outline datepicker">
                        <label
                          htmlFor="exampleDatepicker1"
                          className="form-label required-field"
                        >
                          Name
                          <span className="text-danger mx-2">
                            {apiError.name}
                          </span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleDatepicker1"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <select
                      className="select"
                      id="roleform"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="jobseeker">jobseeker</option>
                      <option value="employer">employer</option>
                    </select>
                    <label
                      className="form-label mx-2 text-primary required-field"
                      htmlFor="roleform"
                    >
                      role
                      <span className="text-danger mx-2">{apiError.role}</span>
                    </label>
                  </div>

                  <div className="row mb-4 pb-2 pb-md-0 mb-md-5">
                    <div className="col-md-8">
                      <div className="form-outline">
                        <label
                          className="form-label required-field"
                          htmlFor="form3Example1w"
                        >
                          password
                          <span className="text-danger mx-2">
                            {apiError.password}
                          </span>
                        </label>
                        <input
                          type="password"
                          id="form3Example1w"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-outline">
                        <label
                          className="text-danger mt-2"
                          htmlFor="form3Example1file"
                        >
                          {formData.role === "jobseeker"
                            ? "CV : cv should be pdf"
                            : "LOGO : image should be jpg or png"}
                          <span className="text-danger mx-2">
                            {apiError.password}
                          </span>
                        </label>
                        <input
                          type="file"
                          id="form3Example1file"
                          className="mt-2 form-control"
                          name="avatar"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-success btn-lg mb-1">
                    Submit
                    <span className="text-danger mx-2">{apiError.other}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
