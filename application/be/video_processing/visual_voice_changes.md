# Modifications to VisualVoice

[VisualVoice](https://github.com/facebookresearch/VisualVoice/tree/main) models made available via Github (latest commit [e57e126](https://github.com/facebookresearch/VisualVoice/tree/e57e126c7aadc78edc7e7436a7a9dd4af8b95d0f) on 25 July 2023) were used for speech separation. 

VisualVoice is licensed under CC BY-NC ([Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/)), and is free to share and adapt for non-commercial purposes as long as appropriate credit is give, licensing information is [linked](https://github.com/facebookresearch/VisualVoice?tab=License-1-ov-file#readme), and changes made are indicated.

This file documents all changes made to VisualVoice code included in `application/be/video_processing/VisualVoice`.

## Removed directories
The following VisualVoice directories were left out of this repo.
* `VisualVoice/av-enhancement`
* `VisualVoice/av-separation-with-context`

## Download pretrained model weights
See [instructions in README.md](../../../README.md#VisualVoice-pretrained-models) to create `pretrained_models` directory. No changes were made to the model architecture and weights provided.

## Save face detection results 
Save bounding boxes from face detector (video preprocessing stage) as `.npz` file, which is a zipped archive of files containing numpy variables. This result is used for video annotation later.

### [utils/detectFaces.py](./VisualVoice/utils/detectFaces.py)
```diff
def main(self):
    ...
    # Output video path
    ...
    csvfile.close()

+    # save bbox results for video annotation use
+   bbox_path = os.path.join(args.output_path, 'bbox')
+   if not os.path.exists(bbox_path):
+       os.mkdir(bbox_path)
+   for id in boxes_dic:
+       utils.save2npz(os.path.join(bbox_path, 'speaker' + str(id+1)+'.npz'), data=boxes_dic[id])
```

## Debug best video frame
Additionally, a bug was found and fixed in the selection of the “best” video frame for each speaker. The face detection probability returned by the face detector is used to select an image of each speakers’ face from the video, which is used to provide facial attribute information to the network. Previously, the same video frame would be used regardless of this this probability as the `best_score` variable was not being updated. 

The best frame is also saved for generating the video transcript later.

### [testRealVideo.py](./VisualVoice/testRealVideo.py)
```diff
def main():
    ...
	for speaker_index in range(opt.number_of_speakers):
        ...
		if opt.reliable_face:
			best_score = 0
			for i in range(10): 
				frame = load_frame(facetrack_path)
				boxes, scores = mtcnn.detect(frame)
				if scores[0] > best_score:
					best_frame = frame	
+					best_score = scores[0] 
+			best_frame.save(facetrack_path[:-4]+"_best.png", "PNG")
+			print("Speaker", speaker_index+1, "reliable face score:", best_score)
```

## Update deprecated functions
Since the release of VisualVoice three years ago, some of the functions and libraries used have been deprecated. 

### [utils/utils.py](./VisualVoice/utils/utils.py)
```diff
-from torch._six import container_abcs, string_classes, int_classes
+string_classes = str
+int_classes = int
+import collections.abc as container_abcs
```

### [testRealVideo.py](./VisualVoice/testRealVideo.py)
As of v0.8.0, the deprecated librosa output module has been removed (see [v0.8.0 changelog](https://librosa.org/doc/latest/changelog.html#v0-8-0), see [PR](https://github.com/librosa/librosa/pull/1062)). Soundfile was used to save the speech separation output files instead. ([stackoverflow ref](https://stackoverflow.com/questions/63997969/attributeerror-module-librosa-has-no-attribute-output))
```diff
-import librosa
+import soundfile as sf
def main():
    ...
	for speaker_index in range(opt.number_of_speakers):
        ...
-		librosa.output.write_wav(os.path.join(opt.output_dir_root, 'speaker' + str(speaker_index+1) + '.wav'), avged_sep_audio, opt.audio_sampling_rate)
+		sf.write(os.path.join(opt.output_dir_root, 'speaker' + str(speaker_index+1) + '.wav'), avged_sep_audio, opt.audio_sampling_rate)
```

### [utils/detectFaces.py](./VisualVoice/utils/detectFaces.py)
Replaced `LandmarksType._2D` with `LandmarksType.TWO_D`, because it was no longer compatible with face-alignment >v1.3.4 ([ref](https://github.com/OpenTalker/SadTalker/issues/611)).
Also changed device to CPU here.
```diff
def main(self):
    ...
-    fa = face_alignment.FaceAlignment(face_alignment.LandmarksType._2D, flip_input=False)
+    fa = face_alignment.FaceAlignment(face_alignment.LandmarksType.TWO_D, flip_input=False, device="cpu")
```

## Use CPU instead of CUDA
The original VisualVoice code was written for a CUDA-enabled device which could utilize GPUs for computation. This project was completed on CPU only. 

### [models/models.py](./VisualVoice/models/models.py)
```diff
class ModelBuilder():
    def build_facial(self, pool_type='maxpool', input_channel=3, fc_out=512, with_fc=False, weights=''):
        ...
-            pretrained_state = torch.load(weights)
+            pretrained_state = torch.load(weights, map_location=torch.device('cpu'))
...
    def build_lipreadingnet(self, config_path, weights='', extract_feats=False):
        ...
-            net.load_state_dict(torch.load(weights))
+            net.load_state_dict(torch.load(weights, map_location=torch.device('cpu')))
...
    def build_unet(self, ngf=64, input_nc=1, output_nc=1, audioVisual_feature_dim=1280, identity_feature_dim=64, weights=''):
        ...
-            net.load_state_dict(torch.load(weights))
+            net.load_state_dict(torch.load(weights, map_location=torch.device('cpu')))
...
    def build_vocal(self, pool_type='maxpool', input_channel=1, with_fc=False, fc_out=64, weights=''):
        ...
-            pretrained_state = torch.load(weights)
+            pretrained_state = torch.load(weights, map_location=torch.device('cpu'))
```

### [options/base_options.py](./VisualVoice/options/base_options.py)
```diff
class BaseOptions():
    ...
    def initialize(self):
-		self.parser.add_argument('--gpu_ids', type=str, default='0', help='gpu ids: e.g. 0  0,1,2, 0,2. use -1 for CPU')

    def parse(self):
        ...
-		str_ids = self.opt.gpu_ids.split(',')
-		self.opt.gpu_ids = []
-		 for str_id in str_ids:
-		 	id = int(str_id)
-		 	if id >= 0:
-		 		self.opt.gpu_ids.append(id)
-
-		# set gpu ids
-		if len(self.opt.gpu_ids) > 0:
-			torch.cuda.set_device(self.opt.gpu_ids[0])
```

### [testRealVideo.py](./VisualVoice/testRealVideo.py)
```diff
def main():
    ...
-	opt.device = torch.device("cuda")
+	opt.device = torch.device("cpu")
    ...
-	print(nets)
+	# print(nets)
    ...
	for speaker_index in range(opt.number_of_speakers):
        ...
		if opt.reliable_face:
            ...
-			frames = vision_transform(best_frame).squeeze().unsqueeze(0).cuda()
+			frames = vision_transform(best_frame).squeeze().unsqueeze(0)
        else:
            ...
-			frame = torch.stack(frame_list).squeeze().unsqueeze(0).cuda()
+			frame = torch.stack(frame_list).squeeze().unsqueeze(0)
        ...
		while sliding_window_start + samples_per_window < audio_length:
            ...
-			audio_spec = torch.FloatTensor(audio_spec).unsqueeze(0).cuda()
+			audio_spec = torch.FloatTensor(audio_spec).unsqueeze(0)
            ...
-			segment_mouthroi = torch.FloatTensor(segment_mouthroi).unsqueeze(0).unsqueeze(0).cuda()
+			segment_mouthroi = torch.FloatTensor(segment_mouthroi).unsqueeze(0).unsqueeze(0)
            ...
        ...
-		audio_spec = torch.FloatTensor(audio_spec).unsqueeze(0).cuda()
+		audio_spec = torch.FloatTensor(audio_spec).unsqueeze(0)
        ...
-		segment_mouthroi = torch.FloatTensor(segment_mouthroi).unsqueeze(0).unsqueeze(0).cuda()
+		segment_mouthroi = torch.FloatTensor(segment_mouthroi).unsqueeze(0).unsqueeze(0)
```