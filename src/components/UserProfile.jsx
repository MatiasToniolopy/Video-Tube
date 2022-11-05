import { Flex, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'
import {getFirestore} from 'firebase/firestore'
import {firebaseApp} from '../firebase-config'
import { useParams } from 'react-router-dom'
import {getUserInfo, userUploadVideos} from '../utils/fetchDara'
import RecommendedVideos from './RecommendedVideos'

const UserProfile = () => {
  const [isLoading, setisLoading] = useState(false)
  const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,technology"
  const [userInfo, setUserInfo] = useState(null)
  const {userId} = useParams()
  const firestoreDb = getFirestore(firebaseApp)
  const [feeds, setFeeds] = useState(null)

  useEffect(() => {
    setisLoading(true)
    if(userId){
      getUserInfo(firestoreDb, userId).then((data) => {
        setUserInfo(data)
      })
      userUploadVideos(firestoreDb, userId).then((feed) => {
        setFeeds(feed)
      })
      setisLoading(false)
    }
  }, [userId])

  if(isLoading) return <Spinner/>

  return (
    <Flex
    alignItems={"center"}
    justifyContent="center"
    width={"full"}
    height="auto"
    p={2}
    direction="column"
    >
      <Flex
        justifyContent={"center"}
        width="full"
        position={"relative"}
        direction="column"
        alignItems={"center"}
      >
        <Image
        src={randomImage}
        height={"320px"}
        width="full"
        objectFit={"cover"}
        borderRadius={"md"}
        />
        <Image
        src={userInfo?.photoURL}
        width="120px"
        objectFit={"cover"}
        border="2px"
        borderColor={"gray.100"}
        rounded="full"
        shadow={"lg"}
        mt="-16"
        />
      </Flex>
      {feeds && (
        <Flex direction={"column"} width="full" my={6}>
          <RecommendedVideos feeds={feeds}/>
        </Flex>
      )}
    </Flex>
  )
}

export default UserProfile