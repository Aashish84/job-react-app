import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobForm from "./components/JobForm";

export default function AddJob() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formDataError, setFormDataError] = useState({
    title: "",
    expire_date: "",
    avatar: "",
    descripton: "",
    error: "",
  });

  const [formData, setFormData] = useState({
    title: "xyz",
    expire_date: "",
    description: "hlo",
    avatar: null,
  });

  function formEmptyError() {
    if (!formData.title) {
      setFormDataError((prev) => {
        return {
          ...prev,
          title: "this is required field",
        };
      });
    }
    if (!formData.expire_date) {
      setFormDataError((prev) => {
        return {
          ...prev,
          expire_date: "this is required field",
        };
      });
    }
    if (!formData.avatar) {
      setFormDataError((prev) => {
        return {
          ...prev,
          avatar: "this is required field",
        };
      });
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

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (formData.title && formData.avatar && formData.expire_date) {
        let form_data = new FormData();
        form_data.append("title", formData.title);
        form_data.append("expire_date", formData.expire_date);
        form_data.append("avatar", formData.avatar);
        form_data.append("description", formData.descripton);

        const access_token = localStorage.getItem("access_token");

        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/jobs`,
          form_data,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (Object.keys(data).length !== 0) {
          navigate("/my-jobs");
        }
        // console.log(data);
      } else {
        formEmptyError();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      let { data } = error.response;

      if (data.msg) {
        if (Array.isArray(data.msg)) {
          data.msg.forEach((el) => {
            setFormDataError((prev) => {
              return {
                ...prev,
                [el.param]: el.message,
              };
            });
          });
          return;
        }
        setFormDataError((prev) => {
          return {
            ...prev,
            error: JSON.stringify(data.msg),
          };
        });
        return;
      }

      setFormDataError((prev) => {
        return {
          ...prev,
          error: JSON.stringify(data),
        };
      });

      // console.log(error);
    }
  }

  return (
    <div className="container text-capitalize col-3">
      {/* <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInput1">job title :</label>
          <input
            type="text"
            className="form-control"
            id="exampleInput1"
            placeholder="Enter job title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {formDataError.title && (
            <small id="emailHelp" className="form-text text-danger">
              {formDataError.title}
            </small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="exampleInput2">job expire date :</label>
          <input
            type="date"
            className="form-control"
            id="exampleInput2"
            placeholder="Enter job date"
            name="expire_date"
            value={formData.expire_date}
            onChange={handleChange}
          />
          {formDataError.expire_date && (
            <small id="emailHelp" className="form-text text-danger">
              {formDataError.expire_date}
            </small>
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="customFile">
            upload job image
          </label>
          <input
            type="file"
            className="form-control"
            id="customFile"
            name="avatar"
            // value={formData.avatar}
            onChange={handleChange}
          />
          {formDataError.avatar && (
            <small className="form-text text-danger">
              {formDataError.avatar}
            </small>
          )}
        </div>
        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-success">
            add new
          </button>
          {isLoading && <div className="spinner-border m-2"></div>}
          {formDataError.error && (
            <small className="form-text text-danger">
              {formDataError.avatar}
            </small>
          )}
        </div>
      </form> */}
      <JobForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        formDataError={formDataError}
        formData={formData}
      />
    </div>
  );
}
