import {type NextPage } from 'next'
import React from 'react'

type Props = {
  params: {
    transcriptionFolderId: string
  }
}

const getTranscriptions = async (transcriptionFolderId: string) => {
  const res = await fetch(`http://localhost:5001/api/v1/transcribe/${transcriptionFolderId}`);
  const resData = await res.text();
  return resData
}

const Page = async ({params}:Props) => {


const text = await getTranscriptions(params.transcriptionFolderId)

  return (
    <>
    <div>{params.transcriptionFolderId}</div>
    <div>{text}</div>
    </>
  )
}

export default Page