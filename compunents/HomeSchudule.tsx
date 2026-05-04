import { View, Text } from 'react-native'
import React from 'react'
import dayjs from 'dayjs'
import clsx from 'clsx'

const HomeSchudule = ( {name, instructor, date, classroom, color}: Classes ) => {
  return (
    <View className={clsx("upcoming-card", "bg-card")} style={ color ? {backgroundColor: color}  : undefined }>
        <View className='upcoming-row m-3'>
            <View className=''>
            <Text className='font-Coopbl m-2 text-subprimary '>{name}</Text>
            <Text className='font-bold' numberOfLines={1}>{instructor}</Text>
            </View>
            <View className='mr-2 items-start'>
                <Text className='m-2  text-foreground/70' numberOfLines={1}>{dayjs(date).format('dd hh:mm A')}</Text>
                <Text className='font-bold' numberOfLines={1}>{classroom}</Text>
            </View>
        </View>
    </View>
  )
}

export default HomeSchudule