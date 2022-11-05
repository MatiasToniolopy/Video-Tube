import { Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import notFoundSvg from '../img/notfound.svg'

const NotFound = () => {
  return (
    <Flex
    width={"full"}
    justifyContent="center"
    alignItems={"center"}
    direction="column"
    >
        <Image src={notFoundSvg} width={600}/>
        <Text
        fontSize={40}
        fontWeight="semibold"
        fontFamily={"cursive"}
        >
        There are no videos in this section yet.
        </Text>
    </Flex>
  )
}

export default NotFound