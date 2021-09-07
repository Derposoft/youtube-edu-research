import { Typography } from '@material-ui/core'
import { useState, useEffect } from 'react'
import api from '../../api'
import { CourseCard } from '../Courses/CourseCard'
import './Courses.css'
import { LectureCard } from './LectureCard'

export function Courses(courseInfo) {
  const [courses, setCourses] = useState({err: 0, courses: []})
  const [course, setCourse] = useState({})
  const [currLecture, setCurrLecture] = useState({})
  const [courseContent, setCourseContent] = useState([])
  useEffect(() => {
    api.getCourses().then(resp => {
      console.log(resp)
      if (resp.status < 400) {
        setCourses({err: 0, courses: resp.data})
      } else {
        setCourses({err: 1, courses: []})
      }
    })
  }, [])
  var onSetCurrLecture = (newcourse) => {
    setCourse(newcourse)
    if (JSON.stringify(newcourse) != '{}') {
      // set curr course/curr lecture
      var currCourse = newcourse
      while (currCourse.playlist != undefined) {
        var currUnderstood = currCourse.playlist[currCourse.curr].understood
        if (currUnderstood == false)
          currCourse = currCourse.playlist[currCourse.curr]
        else
          break
      }
      console.log(currCourse)
      setCurrLecture(currCourse)

      // update course content bottom bar content
      // (this is a simple in-order traversal of the nested playlist/video structure i've built)
      var content = []
      var lecturestack = []
      if (newcourse.playlist != undefined) {
        for (var i = newcourse.playlist.length - 1; i > -1; i--) {
          lecturestack.push(newcourse.playlist[i])
        }
        while (lecturestack.length > 0) {
          var currlec = lecturestack.pop()
          content.push(currlec)
          if (currlec.playlist != undefined) {
            for (var i = currlec.playlist.length - 1; i > -1; i--) {
              lecturestack.push(currlec.playlist[i])
            }
          }
        }
        setCourseContent(content)
      }
    }
  }

  return (
    <div>
      <div className='courses'>
        <Typography variant='h2'>
          Course Selection
        </Typography>
        {courses.err == 0 ? 
        (courses.courses.length == 0 ?
        <Typography>It looks like you're not in any courses... why not <a href='search'>try a few?</a></Typography> :
        (courses.courses.map(course =>  {return <CourseCard onSelectCourse={onSetCurrLecture} courseInfo={course}/>})))
        :
        <Typography color='error'>It looks like there was a problem. Are you logged in?</Typography>}
      </div>
      <div className='currcourse'>
        <Typography variant='h2'>
          Content
        </Typography>
        {(JSON.stringify(currLecture) != '{}') ? 
          <div className='currcourse'>
            <iframe 
              width='560' 
              height='315' 
              src={'https://www.youtube.com/embed/'+currLecture.playlist[currLecture.curr].snippet.resourceId.videoId}
              title='YouTube video player' 
              frameborder='0' 
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' 
              allowfullscreen>
            </iframe>
          </div> :
          <Typography className='course' variant='h6'>Choose a Course to continue above to get started</Typography>
        }
        <div className='courses'>
          {courseContent.map(video => {return <LectureCard lectureInfo={video}/>})}
        </div>
        <p>{JSON.stringify(course)}</p>
      </div>
    </div>
  )
}