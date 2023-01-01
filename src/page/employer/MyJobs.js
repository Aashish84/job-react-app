import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyJobs() {
  const [apiData, setAPIData] = useState({});

  async function getData() {
    try {
      const access_token = localStorage.getItem("access_token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/employer/all-jobs`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );

      setAPIData(data);

      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleDelete(id) {
    try {
      const access_token = localStorage.getItem("access_token");
      let { data } = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/jobs/${id}`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      alert(JSON.stringify(data));
      setAPIData(apiData.filter((el) => el._id !== id));
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  if (Object.keys(apiData).length === 0) {
    return (
      <div className="container">
        <div className="d-flex justify-content-end m-2">
          <Link to="/add-jobs" className="btn btn-success text-right">
            new
          </Link>
        </div>
        <h1>no data found</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-end m-2">
        <Link to="/add-jobs" className="btn btn-success text-right">
          new
        </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">sn</th>
            <th scope="col">job title</th>
            <th scope="col">no of applicants</th>
            <th scope="col">action</th>
          </tr>
        </thead>
        <tbody>
          {apiData.map((el, index) => {
            return (
              <tr key={el._id}>
                <th scope="row">{index + 1}</th>
                <td>{el.title}</td>
                <td>
                  {`${el.applicants.length}`}
                  {el.applicants.length > 0 && (
                    <>
                      <Link to={`/applications/${el._id}`}>view</Link>
                    </>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(el._id)}
                    className="btn btn-warning me-2"
                  >
                    delete
                  </button>
                  <Link
                    to={`/update-jobs/${el._id}`}
                    className="btn btn-danger"
                  >
                    update
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
