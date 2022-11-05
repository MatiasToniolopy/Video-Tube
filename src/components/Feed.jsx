import { Box, SimpleGrid } from '@chakra-ui/react'
import { getFirestore } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { firebaseApp } from '../firebase-config'
import { categoryFeeds, getAllFeeds } from '../utils/fetchDara'
import NotFound from './NotFound'
import Spinner from './Spinner'
import VideoPin from './VideoPin'

const Feed = () => {
  const firestoreDb = getFirestore(firebaseApp)
  const [feeds, setFeeds] = useState(null)
  const [isloading, setIsloading] = useState(false)
  const {categoryId} = useParams()

  useEffect(() => {
    setIsloading(true)
    if(categoryId){
      categoryFeeds(firestoreDb, categoryId).then((data) => {
        setFeeds(data)
        setIsloading(false)
      })
    } else{
      getAllFeeds(firestoreDb).then((data) => {
        setFeeds(data)
        setIsloading(false)
      })
    }
  }, [categoryId])

  if (isloading) return <Spinner msg='Loading your Feeds'/>
  if(!feeds?.length) return <NotFound/>
  return (
    <SimpleGrid
      minChildWidth="300px"
      spacing="15px"
      width="full"
      autoColumns={"max-content"}
      px="2"
      overflow={"hidden"}
    >
      {feeds && feeds.map(data => (
        <VideoPin key={data.id} maxWidth={420} height="80px" data={data}/>
      ))}
    </SimpleGrid>
  );
}

export default Feed