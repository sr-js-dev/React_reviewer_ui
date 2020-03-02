import React from 'react'
import PropTypes from 'prop-types'
import {useDropzone} from 'react-dropzone'

/**
 * File dropzone
 *
 * react-dropzone is much easier to use with functional components
 * hence this style change
 *
 * @param {object} props - React props
 */
function FileDropzone(props) {
  const { wrapperStyle, children, onDrop } = props;
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({onDrop});

  const theme = props.theme || 'border';

  return (
    <div
      className={ "flex flex-col justify-center items-center w-full min-h-50px rounded-lg " + ( theme === "border" ? "border border-2" + ( isDragActive ? "border-water-blue" : "border-dashed" ) : "" ) + ( theme === "solid" ? isDragActive ? " bg-water-blue text-white" : " bg-light-grey-blue-10" : "" ) }
      style={ wrapperStyle }
      {...getRootProps()}
    >
      { !isDragActive &&
        <>
          { children }

          <button
            className="w-32 h-8 rounded mt-5 text-xs text-white font-bold shadow-vp-blue bg-water-blue hover:bg-water-blue-hover hover:shadow-vp-blue-hover"
          >
            Upload...
          </button>
        </>
      }

      { isDragActive &&
        <div>
          Drop the file here
        </div>
      }

      <input {...getInputProps()} />
    </div>
  )
}

FileDropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  children: PropTypes.element,
  wrapperStyle: PropTypes.object
}

export default FileDropzone
