import { Flex, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { firebaseApp } from '../firebase-config';
import { getUserInfo } from '../utils/fetchDara';
import moment from 'moment';
import avatar1 from '../img/avatar1.jpg';

const VideoPin = ({data}) => {
  const bg = useColorModeValue("blackAlpha.700","gray.900");
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue("gray.100","gray.100");

  const [userInfo, setuserInfo] = useState(null)
  const [userId, setuserId] = useState(null)

  const firebaseDb = getFirestore(firebaseApp)

  useEffect(() => {
    if(data) setuserId(data.userId)
    if(userId) getUserInfo(firebaseDb, userId).then(data => setuserInfo(data))
  }, [userId])

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems="center"
      direction={"column"}
      cursor="pointer"
      shadow={"lg"}
      _hover={{ shadow: "xl" }}
      rounded="md"
      overflow={"hidden"}
      position="relative"
      maxWidth={"300px"}
    >
      <Link to={`/videoDetail/${data?.id}`}>
        <video
          src={data.videoUrl}
          muted
          onMouseOver={(e) => e.target.play()}
          onMouseOut={(e) => e.target.pause()}
        />
      </Link>

      <Flex
      position={"absolute"}
      bottom="0"
      left="0"
      p={2}
      bg={bg}
      width="full"
      direction={"column"}
      >
        <Flex width={"full"} justifyContent="space-between" alignItems={"center"}>
          <Text color={textColor} istruncated="true" fontSize={20}>{data.title}</Text>

          <Link to={`/userDetail/${userId}`}>
          <Image src={userInfo?.photoURL? userInfo?.photoURL : avatar1}
          rounded="full"
          width={"50px"}
          height={"50px"}
          border="2px"
          borderColor={bg}
          mt={-10}
          minHeight="50px"
          minWidth={"50px"}
          />
          </Link>
        </Flex>
        <Text fontSize={12} textColor={textColor} ml="auto">
          {moment(new Date(parseInt(data.id)).toISOString()).fromNow()}
        </Text>
      </Flex>
    </Flex>
  );
}

export default VideoPin