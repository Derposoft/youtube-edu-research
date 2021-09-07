import { Card, CardContent, CardActions, Button, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import './Courses.css'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

/**
 * 
 * @param info in the following structure:
 * info = {
 *  title: [title],
 *  description: [desc],
 *  playlistId: [youtube playlist id]
 * }
 * @returns 
 */
export function LectureCard(props) {
  const classes = useStyles()
  var video = props.lectureInfo
  console.log('video.snippet')
  var shortenTitle = (title) => {
    const MAX_LENGTH = 25
    if (title.length > MAX_LENGTH) {
      return title.substring(0, MAX_LENGTH - 3) + '...'
    }
    else {
      return title
    }
  }
  return (
    <div style={{'display': 'inline-block'}}>
      <Card className={classes.root} className='course'>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {video.title}
          </Typography>
            <div>
              <iframe 
                width='200' 
                height='120' 
                src={'https://www.youtube.com/embed/'+video.snippet.resourceId.videoId}
                title='YouTube video player' 
                frameborder='0' 
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' 
                allowfullscreen>
              </iframe>
            </div>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => props.onSelectCourse(video)}>{shortenTitle(video.snippet.title)}</Button>
        </CardActions>
      </Card>
    </div>
  )
}