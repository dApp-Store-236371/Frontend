import React, { ChangeEvent, useState } from "react";
import {
  MDBInput,
  MDBBtn,
  MDBCheckbox,
  MDBTextArea,
  MDBValidationItem,
  MDBInputGroup,
  MDBValidation,
  MDBFile,
} from "mdb-react-ui-kit";
import "../CSS/UploadForm.css";
import { MAX_DESCRIPTION_LENGTH } from "../../../ReactConstants";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../Shared/CSS/appImage.css";

export default function UploadForm() {
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>("");

  const onImgUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadedImgUrl(e.target.value);
    const img = document.getElementById("upload-form-app-img");
    if (img) {
      img.style.display = "block";
    }
    formik.handleChange(e);
  };

  const formik = useFormik<any>({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      appFile: "",
      name: "",
      price: "",
      description: "",
      img_url: "",
      company: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .max(15, "Must be at most 15 characters long!")
        .required("Must type name!"),
      price: Yup.number()
        .required("Must type number!")
        .moreThan(0, "Price must be greater than 0!")
        .typeError("Must be a number!"),
      description: Yup.string()
        .trim()
        .max(250, "Must be at most 250 characters long!")
        .required("Description cannot be empty!"),
      company: Yup.string()
        .trim()
        .max(15, "Must be at most 15 characters long!")
        .required("Must type name!"),
      img_url: Yup.string()
        .required("Must have an image!")
        .matches(
          /(https?:\/\/.*\.(?:png|jpg))/i,
          "Must be a url of a png/jpg file!"
        )
        .url("Must be a url!"),
    }),
    onSubmit: (values) => {
      console.log("Upload form submitted with values: ", values);
      //createTorrent(values.appFile);
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    formik.submitForm();
  };

  return (
    <>
      <h1 id="upload-form-title"> Upload You App: </h1>
      <form id="upload-form" className="row g-3" onSubmit={handleSubmit}>
        <div className={"row g-1"}>
          <MDBFile
            size="lg"
            id="form-file-upload"
            name="appFile"
            value={formik.values.appFile}
            onChange={formik.handleChange}
          />
        </div>
        <div className={"row g-2"}>
          <div className="col-md-4">
            <MDBInput
              value={formik.values.name}
              name="name"
              onChange={formik.handleChange}
              id="appname-input"
              label="Application Name"
              maxLength={20}
            />
            {formik.errors.name ? (
              <p className={"invalid-field-text"}>{formik.errors.name}</p>
            ) : null}
          </div>
          <div className="col-md-4">
            <MDBInput
              value={formik.values.company}
              name={"company"}
              id="company-input"
              label="Company"
              onChange={formik.handleChange}
            />
            {formik.errors.company ? (
              <p className={"invalid-field-text"}>{formik.errors.company}</p>
            ) : null}{" "}
          </div>
          <div className="row g-2">
            <div className="col-md-2">
              <MDBInput
                value={formik.values.price}
                name="price"
                onChange={formik.handleChange}
                id="price-input"
                label="Price"
              />
              {formik.errors.price ? (
                <p className={"invalid-field-text"}>{formik.errors.price}</p>
              ) : null}
            </div>
            <div className="col-md-6">
              <MDBInput
                value={formik.values.img_url}
                name="img_url"
                onChange={onImgUrlChange}
                id="image-url-input"
                label="Image URL"
              />
              {formik.errors.img_url ? (
                <p className={"invalid-field-text"}>{formik.errors.img_url}</p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="row g-2">
          <div className="col-md-6">
            <MDBTextArea
              value={formik.values.description}
              name="description"
              onChange={formik.handleChange}
              id="description-input"
              label="Description"
              rows={5}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            {formik.errors.description ? (
              <p className={"invalid-field-text"}>
                {formik.errors.description}
              </p>
            ) : null}
          </div>

          <div className={"col-md-2"}>
            <img
              src={uploadedImgUrl}
              className={"app-image"}
              alt={""}
              id={"upload-form-app-img"}
              onError={() => {
                const img = document.getElementById("upload-form-app-img");
                if (img) {
                  img.style.display = "none";
                }
              }}
            />
          </div>
        </div>
        <div className="row g-1">
          <div className="col-md-2">
            <MDBBtn type="submit">Upload</MDBBtn>
          </div>
        </div>
      </form>
    </>
  );
}
/*
return (
  <MDBValidation className="row g-3" id="upload-form">
    <MDBValidationItem className="col-md-4">
      <MDBInput
        value={formValue.name}
        name="name"
        onChange={onChange}
        id="appname-input"
        required
        label="Application Name"
      />
    </MDBValidationItem>
    <MDBValidationItem className="col-md-4">
      <MDBInput
        value={formValue.company}
        name="company"
        onChange={onChange}
        id="company-input"
        required
        label="Company"
      />
    </MDBValidationItem>
    <MDBValidationItem className="col-md-4">
      <MDBInput
        value={formValue.price}
        name="price"
        onChange={onChange}
        id="price-input"
        required
        label="Price"
      />
    </MDBValidationItem>
    <MDBValidationItem
      className="col-md-6"
      feedback="Please provide a valid image."
      invalid
      tooltip
    >
      <MDBInput
        value={formValue.img_url}
        name="img_url"
        onChange={onChange}
        id="img-url-input"
        required
        label="Image URL"
      />
    </MDBValidationItem>
    <MDBValidationItem
      className="col-md-6"
      feedback="Please provide a valid zip."
      invalid
    >
      <MDBTextArea
        value={formValue.description}
        name="description"
        onChange={onChange}
        id="description-input"
        required
        label="Description"
        maxLength={MAX_DESCRIPTION_LENGTH}
        rows={5}
      />
    </MDBValidationItem>
    <div className="col-12">
      <MDBBtn type="submit" onSubmit={() => console.log("a")}>
        Submit form
      </MDBBtn>
      <MDBBtn type="reset">Reset form</MDBBtn>
    </div>
  </MDBValidation>
);
}
*/
