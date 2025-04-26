
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

// tablo5.docx dosyasını import et
import tablo5Docx from './tablo5.docx'; // doğru dizinde olduğundan emin ol

export async function tablo5Doldur(veriler) {
  const response = await fetch(tablo5Docx);
  const arrayBuffer = await response.arrayBuffer();

  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.setData(veriler);

  try {
    doc.render();
  } catch (error) {
    console.error('HATA:', error);
    throw error;
  }

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  saveAs(blob, 'Tablo5-Dolu.docx');
}
