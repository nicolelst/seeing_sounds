export default function downloadFile(
  url: string,
  filename: string,
  filetype: string
) {
  if (url) {
    // https://stackoverflow.com/a/63965930
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.type = filetype;

    document.body.appendChild(link); // append html link element to page
    link.click(); // start download
    link.parentNode?.removeChild(link); // clean up and remove link
  }
}
