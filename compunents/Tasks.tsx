import { View, Text } from 'react-native'
import React from 'react'
import clsx from 'clsx'
import dayjs from 'dayjs'

const Tasks = ({name,subject,dueDate,priority}: Tasks) => {
  return (
    <View
      className={clsx("upcoming-card", "bg-card")}
      style={{
        backgroundColor:
          priority === "High"
            ? "#d8645b"
            : priority === "Medium"
            ? "#da8641"
            : priority === "Low"
            ? "#4ae296"
            : undefined,
      }}
    >
        <View className="upcoming-row mb-2">
            <Text className='font-Coopbl text-subprimary text-2xl'>{name}</Text>
        </View>
        <View>
            <Text className='font-Sans-SemiBold'>{subject}</Text>
            <Text className='font-Sans-SemiBold'>Due At: {dayjs(dueDate).format('DD/MM/YY')}</Text>
        </View>
    </View>
  )
}

export default Tasks