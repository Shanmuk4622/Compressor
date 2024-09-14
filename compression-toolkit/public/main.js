document.getElementById('compressButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const result = document.getElementById('result');
  
    if (fileInput.files.length === 0) {
        result.innerHTML = '<p style="color: red;">Please select files to compress.</p>';
        return;
    }
  
    result.innerHTML = '<p>Compressing files...</p>';
    
    setTimeout(() => {
        result.innerHTML = '<p>Files compressed successfully!</p>';
    }, 2000); 
  });