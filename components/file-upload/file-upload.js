import { useVariantState } from '@app-elements/use-variant-state'
  
import './file-upload.less'

export const FileInput = ({
  accept = 'image/*',
  disabled,
  uploading,
  onChange,
  children
}) =>
  <label class={`file-container${disabled ? ' disabled' : ''}`}>
    <span className='wrapper'>
      <span className={`icon ${uploading ? 'loader' : 'upload'}`} />
      {children}
    </span>
    <input type='file' accept={accept} onChange={onChange} disabled={disabled} />
  </label>

/*
const onChange = (file) => {
  const { promise } = makeRequest({
    endpoint: 'files',
    method: 'post',
    data: {
      fileName: file.name,
      contentType: file.type
    }
  })
  promise
    .then(({ url, fileId, contentType, s3Data }) => {
      let formData = new window.FormData()
      for (const key in s3Data.fields) {
        formData.append(key, s3Data.fields[key])
      }
      formData.append('file', file)
      return makeExternalRequest(s3Data.url, { data: formData, method: 'POST' }) 
    })
    .catch()
}

function makeExternalRequest (url, opts = {}) {
  const { method, data: body } = opts
  return new Promise((resolve, reject) =>
    window.fetch(url, { method, body })
      .then(res => resolve(res))
      .catch(e => console.error(e) || reject(e))
  )
}
*/

export function FileUpload ({
  formName,
  name,
  accept,
  disabled,
  onChange,
  children
}) {
  const {
    checkState,
    transitionTo,
    Uploading,
    Uploaded,
    Failed
  } = useVariantState({
    initial: 'Initial',
    states: {
      Initial: [],
      Uploading: [],
      Uploaded: [],
      Failed: [String]
    },
    transitions: {
      Initial: ['Uploading'],
      Uploading: ['Uploaded', 'Failed'],
      Failed: ['Initial']
    },
    effects: {
      Uploading: () => {
      },
      Uploaded: () => {
      },
      Failed: (reason) => {
      }
    }
  })
}
