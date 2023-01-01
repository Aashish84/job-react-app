import React from "react";

export default function JobForm(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <div className="form-group">
        <label htmlFor="exampleInput1">job title :</label>
        <input
          type="text"
          className="form-control"
          id="exampleInput1"
          placeholder="Enter job title"
          name="title"
          value={props.formData.title}
          onChange={props.handleChange}
        />
        {props.formDataError.title && (
          <small id="emailHelp" className="form-text text-danger">
            {props.formDataError.title}
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
          value={props.formData.expire_date}
          onChange={props.handleChange}
        />
        {props.formDataError.expire_date && (
          <small id="emailHelp" className="form-text text-danger">
            {props.formDataError.expire_date}
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
          onChange={props.handleChange}
        />
        {props.formDataError.avatar && (
          <small className="form-text text-danger">
            {props.formDataError.avatar}
          </small>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="exampleInput2">job description :</label>
        <textarea
          className="form-control"
          id="exampleInput2"
          name="description"
          value={props.formData.description}
          onChange={props.handleChange}
        />
        {props.formDataError.description && (
          <small id="emailHelp" className="form-text text-danger">
            {props.formDataError.description}
          </small>
        )}
      </div>
      <div className="d-flex align-items-center m-2">
        <button type="submit" className="btn btn-success">
          submit
        </button>
        {props.isLoading && <div className="spinner-border m-2"></div>}
        {props.formDataError.error && (
          <small className="form-text text-danger">
            {props.formDataError.avatar}
          </small>
        )}
      </div>
    </form>
  );
}
