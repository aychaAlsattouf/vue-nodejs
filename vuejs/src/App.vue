<template>
<v-app>
    <div id="app">
        <div class="text-h2 font-weight-medium text-center pb-10">Annotaions {{selected }}</div>
        <v-row justify="center" class="ml-5" >
            <v-col md="2" >
                <v-row class="mt-7">
                    <v-file-input
                        accept="image/*"
                        label="Select Image"
                        @change="onSelectedImage"
                        prepend-icon="mdi-camera"
                        outlined
                        single-line
                        dense
                    ></v-file-input>
                </v-row>
                <v-row>
                     <v-text-field
                        v-model="link"
                        label="image link from storage"
                        single-line
                        outlined
                        dense
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-btn 
                        outlined 
                        block 
                        dense 
                        @click="onUpload"
                        >Upload
                    </v-btn>
                </v-row>
                <v-row class="mt-10">
                    <v-select
                    v-model="selected"
                        v-show="showLabelBox"
                        :items="labels"
                        item-text="name"
                        item-value="id"
                        label="Labels"
                        dense
                        outlined
                        @change="AddLabel"
                    ></v-select>
                </v-row>
            </v-col>
            <v-col md="6" >
                <div id="image-wrapper" :style="{backgroundImage: `url(${backgroundImage})`}" @mousedown="startDrawingBox" @mousemove="changeBox" @mouseup="stopDrawingBox">
                    <Box v-if="drawingBox.active" :b-width="drawingBox.width" :b-height="drawingBox.height" :b-top="drawingBox.top" :b-left="drawingBox.left" :b-label="drawingBox.label"/>
                    <Box v-for="(box, i) in boxes" :key="i" :b-top="box.top" :b-left="box.left" :b-width="box.width" :b-height="box.height" :b-label="box.label"/>
                </div>
            </v-col>
            <v-col md="4" align="center" justify="center">
                <div class="text-h4 font-weight-medium text-center pb-10">Boxes</div>
                  <v-simple-table
                        fixed-header
                        class="mp-16" 
                    >
                        <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="text-center">
                                Label Id
                            </th>
                            <th class="text-center">
                                Top
                            </th>
                            <th class="text-center">
                                Left
                            </th>
                            <th class="text-center">
                                Width
                            </th>
                            <th class="text-center">
                                Height
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="box in boxes"
                            :key="box.name"
                            >
                            <td class="text-center">{{ box.label_id }}</td>
                            <td class="text-center" >{{ box.top }}</td>
                            <td class="text-center">{{ box.left }}</td>
                            <td class="text-center">{{ box.width }}</td>
                            <td class="text-center">{{ box.height }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                <v-btn outlined block type="submit" @click="saveAnnotation()">Save</v-btn>
            </v-col>
        </v-row>
      </div>
    </v-app>
</template>

<script>
    import Box from "./components/Box";
    import {pick} from 'lodash';
    import { saveAs } from 'file-saver';
    import axios from "axios";

    const getCoursorLeft = (e) => {
        return e.pageX - 10;
    };

    const getCoursorTop = (e) => {
        return e.pageY - 10;
    };

    export default {
        name: 'app',
        components: {Box},
        data: function () {
            return {
              link:'',
              labels:[{name:'Labels',id:'0'}],
              selected:undefined,
              backgroundImage:'https://trendingpics.com/media/images/ori/2021/10/11/image-8744251633917897.jpg',
                drawingBox: {
                    active: false,
                    top: 0,
                    left: 0,
                    height: 0,
                    width: 0,
                    label:null
                },
                label:null,
                boxes: [],
                showLabelBox:false,
                selectedImage:"https://trendingpics.com/media/images/ori/2021/10/11/image-8744251633917897.jpg",
                
            }
        },
        methods: {
          onSelectedImage(event) {
            console.log(event.target.files[0])
             //let image = event.target.files[0];
             //this image should be stored in sotrage place like firebase or any another cloud storage
          },
          AddLabel(id) {
            let length = this.boxes.length-1;
            this.boxes[length].label_id = id;
            this.showLabelBox = false;
          },
          
            startDrawingBox(e) {
                this.selected=this.labels[0];
                this.drawingBox = {
                    width: 0,
                    height: 0,
                    top: getCoursorTop(e),
                    left: getCoursorLeft(e),
                    active: true,
                    label_id:null
                    
                };
            },
            changeBox(e) {
                if (this.drawingBox.active) {
                    this.drawingBox = {
                        ...this.drawingBox,
                        width: getCoursorLeft(e) - this.drawingBox.left,
                        height: getCoursorTop(e) - this.drawingBox.top,
                    };
                }
                
            },
            stopDrawingBox() {
                if (this.drawingBox.active) {
                  this.showLabelBox = true; 
                    if (this.drawingBox.width > 5) {
                        this.boxes.push({...pick(this.drawingBox, ['width', 'height', 'top', 'left','label_id'])});
                    }
                    this.drawingBox = {
                        active: false,
                        top: 0,
                        left: 0,
                        height: 0,
                        width: 0,
                        label_id:null
                    }
                    
                }
            },
             onUpload () {
              this.backgroundImage= this.link
          },
            saveAnnotation() {
              console.log(this.boxes)
              // save to txt 
                var boxes = JSON.parse(JSON.stringify(this.boxes))
                var string = [];
               
                for(var i = 0; i < boxes.length; i++) {
                  var a = boxes[i].label_id+" "+boxes[i].top+" "+boxes[i].left+" "+boxes[i].height+" "+boxes[i].width+"\n";
                  string.push(a);
                }
              var blob = new Blob(string, {type: "text/plain;charset=utf-8"});
              saveAs(blob, "annotation.txt");

              //save to database 
                for(var j = 0; j < boxes.length; j++) {
                    axios.post("http://localhost:3000/annotation",boxes[j])
                    .then(console.log(boxes[j]))
                    .catch(error => {
                    this.errorMessage = error.message;
                    console.error("There was an error!", error);
                    });
                    }
                },

             getLabels() {
                axios.get("http://localhost:3000/label")
                    .then(response => {
                        response.data.forEach(label => {
                            this.labels.push(label)
                        });
                        console.log(response.data)
                        })
                    .catch(error => {
                        this.errors.push(error);
                    });
                    
            }
        },
        mounted(){
           this.getLabels();
        },
       
     
    }
</script>

<style lang="scss" scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
    #image-wrapper {
            height: 640px;
            width: 640px;
            background-repeat: no-repeat;
             /* Center horizontally*/
             margin: 0 auto;
              
    }
</style>