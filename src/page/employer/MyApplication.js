import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function MyApplications() {
  const { id } = useParams();

  const [apiData, setAPIData] = useState({});

  async function getApplications() {
    try {
      const access_token = localStorage.getItem("access_token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/employer/job-applications/${id}`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(data);
      setAPIData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getApplications();
    // eslint-disable-next-line
  }, []);

  // loading
  if (Object.keys(apiData).length === 0) {
    return (
      <>
        <h1 className="text-capitalize text-center">No applications yet</h1>
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
          <div key={el._id}>
            <div className="row m-2 justify-content-center">
              <div className="col-md-2 p-0">
                <img
                  src={`${process.env.REACT_APP_SERVER_URL}/job_img/${el.image}`}
                  alt="job_img"
                  style={{ width: "100%", height: "200px" }}
                />
              </div>
              <div
                className="col-md-6"
                style={{ backgroundColor: "#c0c0c0aa" }}
              >
                <h1>job_title : {el.title}</h1>
              </div>
            </div>
            {el.applicants.length > 0 && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">sn</th>
                    <th scope="col">applicant name</th>
                    <th scope="col">email</th>
                    <th scope="col">cv</th>
                  </tr>
                </thead>
                <tbody>
                  {el.applicants.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.applied_by_detail.name}</td>
                        <td>{item.applied_by_detail.email}</td>
                        <td>
                          {item.applied_by_detail.file && (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`${process.env.REACT_APP_SERVER_URL}/user_file/${item.applied_by_detail.file}`}
                            >
                              view
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
