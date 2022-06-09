import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {
  MDBInput,
  MDBBtn,
  MDBTextArea,
} from "mdb-react-ui-kit";
import "../../../CSS/UploadForm.css";
import {AppCategories, APPS_PER_PAGE, MAX_DESCRIPTION_LENGTH} from "../../../ReactConstants";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../../CSS/appImage.css";
import { uploadApp} from "../../../Web3Communication/Web3ReactApi";
import { toast } from "react-toastify";
//import { createMagnetLink } from "../../../../electronapp/main";
import { createMagnetLink } from "../../Shared/utils";
//import { createMagnetLink } from "../../../electronCommunication";

interface UploadFormProps {
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
}
export default function UploadForm({
  isUploading,
  setIsUploading,
}: UploadFormProps) {
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>("");
  const [weiToDollars, setWeiToDollars] = useState<number>(0)

  const onImgUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadedImgUrl(e.target.value);
    const img = document.getElementById("upload-form-app-img");
    if (img) {
      img.style.display = "block";
    }
    formik.handleChange(e);
  };

  

  

  useEffect(() => {
    fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
        .then(response => response.json())
        .then(data => {
          console.log(data.data.rates.BUSD)
          const etherToUSD: number = data.data.rates.BUSD
          console.log("etherToUSD: ", etherToUSD)
          console.log("weiToUSD :" ,  etherToUSD / (1_000_000_000_000_000_000))
          setWeiToDollars(etherToUSD / (1_000_000_000_000_000_000))


        });
  }, [])

  const formik = useFormik<any>({

    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      name: "App Name",
      price: "50",
      description: "Default App Description",
      img_url: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
      company: "Default Company",
      category:""

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
       category: Yup.string()
           .trim()
           .required("Must select a category!")
    }),
    onSubmit: async (values) => {

      if (isUploading) {
        toast.error("Wait for seed initiation to finish before starting another!");
        return;
      }
      setIsUploading(true);
      console.log("Upload form submitted with values: ", values);
      let publishingToastId = toast.loading(`Publishing ${values.name}... Don't forget to confirm the transaction!`, {
        autoClose: false,
      });
      console.log("form values: ", values)
      try{
        let [magnet_link, sha] = await createMagnetLink(values.appFile);

      console.log("after magnet link created: ", magnet_link)

      //createTorrent(values.appFile);
      //.then ( (results from electron which include magnet link & SHA) => {
      await uploadApp(
        values.name,
        magnet_link,
        values.description,
        values.company,
        values.img_url,
        values.price,
        sha,
          values.category,
      )
        .then(() => {
          toast.update(publishingToastId, {
            render: `Published ${values.name} 🎉🎉🎉`,
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
        })
        .catch((error: any) => {
          toast.update(publishingToastId, {
            render: `Failed to publish ${values.name}! ${error}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          console.log(error);
        })
        .finally(() => {
          setIsUploading(false);
        });
      }
    
    catch(err: any){
      console.log("Error creating magnet link: ", err)
      toast.update(publishingToastId, {
        render: `Failed to publish ${values.name}! Error: ${err}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });

    }
    finally{
      setIsUploading(false);
    }
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
          <div className="col-md-4">

            <select id={"category-input"} name={"category"} className="mdb-select md-form" onChange={(e) => formik.setFieldValue("category", e.target.value)} defaultValue={""}>
              <option value={""} disabled selected >{"Category"}</option>
              {Object.values(AppCategories).filter(category => category !== AppCategories.All).map( (category) => (
                  <option key={category} value={category}>{category}</option>
              ) )}
            </select>
            {formik.errors.category ? (
                <p className={"invalid-field-text"}>{formik.errors.category}</p>
            ) : null}{" "}
          </div>
          <div className="row g-2">
            <div className="col-md-9" style={{display:"flex", alignItems: "center",
              justifyContent: "left", gap: "1em"}}>
              <MDBInput
                value={formik.values.price}
                name="price"
                onChange={formik.handleChange}
                id="price-input"
                label="Price (Wei)"
              />
              {formik.errors.price ? (
                <p className={"invalid-field-text"}>{formik.errors.price}</p>
              ) : null}
              {
                (isNaN(formik.values.price)) ? <h6> </h6> :  <h6 >{`Approximately ${(formik.values.price * weiToDollars).toFixed(20)} $`}</h6>
              }

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
            <MDBBtn id="submit-btn" type="submit">
              Upload
            </MDBBtn>
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
