import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import ApplyModal from "../../components/ApplyModal";
import { Link } from "react-router-dom";

export default function Home() {
  let [clickedjob, setClickedJob] = useState({});
  const [apiData, setAPIData] = useState({});

  // pagination state
  const [page, setPage] = useState(1);

  // modal state and function
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handlePaginationChange(event, value) {
    setPage(value);
  }

  // to get job from api
  async function getJob() {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/jobs?page=${page}`
      );

      // console.log(data);
      setAPIData(data);
    } catch (error) {
      console.log(error);
    }
  }

  // called when page is changed by pagination
  useEffect(() => {
    getJob();
    // eslint-disable-next-line
  }, [page]);

  // loading
  if (Object.keys(apiData).length === 0) {
    return (
      <h1>
        loading...<span className="spinner-border"></span>
      </h1>
    );
  }

  return (
    <>
      <div className="container">
        <div className="row">
          {apiData.jobs.map((el) => {
            const d = new Date(el.expire_date);
            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            const day = d.getDate();
            return (
              <div className="col-sm-4 " key={el._id}>
                <div
                  className="w-100 border border-primary m-2"
                  style={{
                    height: "200px",
                    backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}/job_img/${el.image})`,
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className="h-100 w-100 p-2 text-light d-flex flex-column justify-content-between text-capitalize"
                    style={{ backgroundColor: "rgb(0 0 0 / 60%)" }}
                  >
                    <div>
                      <h3>{`posted by :${el.employer[0].name}`}</h3>
                    </div>
                    <div>
                      <Link
                        to={`/job/${el._id}`}
                        style={{ textDecoration: "none", color: "#afd5f0" }}
                      >
                        <h2 className="m-0 p-0">{`title : ${el.title}`}</h2>
                      </Link>
                      <p>{`expire on : ${year}-${month}-${day}`}</p>
                      <button
                        className="btn btn-success"
                        type="button"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() => {
                          // console.log(el);
                          setClickedJob(el);
                          handleOpen();
                        }}
                      >
                        apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Pagination
          className="d-flex justify-content-center m-auto"
          count={apiData.total_page}
          shape="rounded"
          page={page}
          onChange={handlePaginationChange}
        />
      </div>
      <ApplyModal
        open={open}
        handleClose={handleClose}
        clickedjob={clickedjob}
      />
    </>
  );
}
