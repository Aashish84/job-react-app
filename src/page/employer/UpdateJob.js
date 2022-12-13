import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobForm from "./components/JobForm";

export default function UpdateJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formDataError, setFormDataError] = useState({
    title: "",
    expire_date: "",
    avatar: "",
    error: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    expire_date: "",
    avatar: null,
    image: "",
  });

  async function getJobByID() {
    try {
      const access_token = localStorage.getItem("access_token");

      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/jobs/${id}`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );

      let date = new Date(data.expire_date);

      setFormData((prev) => {
        return {
          ...prev,
          title: data.title,
          expire_date: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`,
          image: data.image,
        };
      });
    } catch (error) {
      setFormDataError((prev) => {
        return {
          ...prev,
          error: JSON.stringify(error),
        };
      });
    }
  }
  useEffect(() => {
    getJobByID();
    // eslint-disable-next-line
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem("access_token");
      await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/jobs/${id}`,
        formData,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (formData.avatar !== null) {
        const form_data = new FormData();
        form_data.append("avatar", formData.avatar);
        await axios.patch(
          `${process.env.REACT_APP_SERVER_URL}/jobs/img/${id}`,
          form_data,
          {
            headers: {
              authorization: `Bearer ${access_token}`,
            },
          }
        );
      }
      navigate("/my-jobs");
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    const { name, value, files, type } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: type === "file" ? files[0] : value,
      };
    });
  }

  return (
    <div className="container">
      <div className="col-3 m-auto">
        {formData.image && (
          <img
            src={`${process.env.REACT_APP_SERVER_URL}/job_img/${formData.image}`}
            alt="hello"
            style={{ height: "200px", width: "300px" }}
          />
        )}
        <JobForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={formData}
          formDataError={formDataError}
        />
      </div>
    </div>
  );
}
