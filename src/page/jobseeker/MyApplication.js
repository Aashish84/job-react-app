import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyApplication() {
  const [apiData, setAPIData] = useState({});

  async function myApplications() {
    try {
      const access_token = localStorage.getItem("access_token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/jobseeker/all-application`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      setAPIData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    myApplications();
  }, []);

  // loading
  if (Object.keys(apiData).length === 0) {
    return (
      <>
        <h1 className="text-capitalize text-center">
          you haven`t applied to any job yet
        </h1>
        <div className="text-center">
          <Link to="/">goto home</Link>
        </div>
      </>
    );
  }

  return (
    <div className="container m-auto">
      {apiData.map((el) => {
        return (
          <div className="row m-2 justify-content-center" key={el._id}>
            <div className="col-md-2 p-0">
              <img
                src={`${process.env.REACT_APP_SERVER_URL}/job_img/${el.job_detail.image}`}
                alt="job_img"
                style={{ width: "100%", height: "200px" }}
              />
            </div>
            <div
              className="col-md-6 text-capitalize"
              style={{ backgroundColor: "#c0c0c0aa" }}
            >
              <h1>{el.job_detail.title}</h1>
              <h2>by : {el.job_detail.employer_detail.name}</h2>
              <Link to={`/job/${el._id}`}>view</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
