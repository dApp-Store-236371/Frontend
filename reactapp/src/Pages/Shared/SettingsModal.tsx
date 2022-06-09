import { MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle } from "mdb-react-ui-kit";
import { Dispatch, SetStateAction } from "react";


interface SettingsModal{
    setDefaultPath: Dispatch<SetStateAction<string>>;
    defaultPath: string;
    currAccount: string;
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    
}

export function SettingsModal(props: SettingsModal){

    return(
        <div id="settings-modal-wrapper">
   <MDBModal
        show={props.showModal}
        setShow={props.setShowModal}
        tabIndex={-1}
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
                <MDBModalTitle> Settings </MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody style={{

                        textAlign: "left",
                        }}>
            <h6 > {`Account: ${props.currAccount}`}</h6>

                <div className="form-group" >
                    <label htmlFor="defaultPath"  >Default Path</label>
                    <input type="text" className="form-control" id="defaultPath" aria-describedby="defaultPathHelp" 
                    placeholder="Enter default path" value={props.defaultPath} onChange={(e) => props.setDefaultPath(e.target.value)} />
                    <small id="defaultPathHelp" className="form-text text-muted">
                        This is the default path to which apps will be downloaded and from which they will be seeded on startup.
                    </small>
                    
                </div>


      
            </MDBModalBody>

            <MDBModalFooter  style={{}}>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
            </div>
    )
}