import { ChangeEvent, useState } from 'react';

function FileUploadSingle() {
  const [file, setFile] = useState<File>();
  const [fix, setFix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const downloadFile = ({ data, fileName, fileType }: { data: any, fileName: string, fileType: string }): void => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const exportToJson = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    downloadFile({
      data: JSON.stringify(fix),
      fileName: 'users.json',
      fileType: 'text/json',
    })
  }


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    setLoading(true)
    if (!file) {
      return;
    }
    const formData = new FormData();

    formData.append('File', file);
    console.log(file, formData);
    fetch('http://localhost:3001/api/parse-logs',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setFix(data.logs);
        setLoading(false)
      })
      .catch((err) => {setErr(err.message); setLoading(false)});
  };

  return (
    <div>
      {loading ? <div>Loading...</div>:(
        <div>
      <h1 style={{ backgroundColor: "teal" }} >Please try uploading</h1>
      <div>
      <label>Name Of File :{file && `${file.name} - ${file.type}`}</label>
        <input type="file" onChange={handleFileChange} />
        </div>
        <br />
        <label>Submit File {" "}
        <button onClick={handleUploadClick}>Upload</button>
        </label>
        <p>{err}</p>
      {fix && fix.length > 0 && <div>
        <button type='button' onClick={exportToJson}>
          Download file
        </button>
      </div>}
      </div>
      )
    }
    </div>
  );
}

export default FileUploadSingle;