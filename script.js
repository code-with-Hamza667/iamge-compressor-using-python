const uploadArea = document.getElementById('upload-area');
const input = document.getElementById('file-input');
const output = document.getElementById('output');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');

uploadArea.addEventListener('click', () => input.click());

uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.style.background = "#e0e0e0";
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.background = "#fafafa";
});

uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.style.background = "#fafafa";
  handleFiles(e.dataTransfer.files);
});

input.addEventListener('change', () => handleFiles(input.files));

qualitySlider.addEventListener('input', () => {
  qualityValue.textContent = qualitySlider.value;
  if (input.files.length > 0) handleFiles(input.files);
});

function handleFiles(files) {
  output.innerHTML = ''; // clear previous
  const quality = parseFloat(qualitySlider.value);

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(blob => {
          const compressedUrl = URL.createObjectURL(blob);
          const sizeKB = (blob.size / 1024).toFixed(1);
          const originalKB = (file.size / 1024).toFixed(1);
          const saved = (100 - (blob.size / file.size) * 100).toFixed(1);

          const downloadLink = document.createElement('a');
          downloadLink.href = compressedUrl;
          downloadLink.download = 'compressed_' + file.name;
          downloadLink.className = 'download-link';
          downloadLink.textContent = `📥 Download ${file.name} (${sizeKB} KB)`;

          const info = document.createElement('p');
          info.textContent = `Original: ${originalKB} KB | Compressed: ${sizeKB} KB | Saved: ${saved}%`;

          output.appendChild(downloadLink);
          output.appendChild(info);
          output.appendChild(img.cloneNode());
        }, 'image/jpeg', quality);
      };
    };
  });
}
