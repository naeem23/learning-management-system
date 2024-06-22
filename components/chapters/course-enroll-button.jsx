"use client"

import { formatPrice } from "@/lib/format"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { Button } from "../ui/button"

export const CourseEnrollButton = ({courseId, price}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/checkout`);

      window.location.assign(response.data.url)
    } catch {
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button size="sm" className="w-full md:w-auto" onClick={onClick} disabled={isLoading}>
        Enroll for {formatPrice(price)}
    </Button>
  )
}

