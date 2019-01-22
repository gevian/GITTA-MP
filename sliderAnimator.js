function SliderAnimator(controls, surface, stretchWidget)
{
	this.controls = controls;
    this.surface = surface;
	this.stretchWidget = stretchWidget;
    
	this.instructions = [];
	this.duration = null;
	
	this.state = "Rolled";
}


SliderAnimator.prototype.startSliderAnimations = function(instructions, duration)
{
	this.controls.disableForms(false);
	this.instructions = instructions;
	this.duration = duration;
	
	for ( var i = 0; i < this.instructions.length; i++)
	{
		var instruction = this.instructions[i];
		instruction.changePerSecond = (instruction.target - instruction.slider.value) / duration;
		instruction.finished = false;
	}
	
	this.state = "Animating Sliders";
}

SliderAnimator.prototype.startStretchAnimations = function(instructions, duration, unstretching)
{
	this.instructions = instructions;
	this.duration = duration;
	
	for ( var i = 0; i < this.instructions.length; i++)
	{
		var instruction = this.instructions[i];
        
		instruction.changePerSecond = (instruction.target - Number(instruction.circle.getAttribute('cy'))) / duration;
		instruction.finished = false;
	}

    if (unstretching)
        this.state = "Animating Unstretching";
    else
        this.state = "Animating Stretching";        
}


// TODO: Improve increment for large step values; currently it breaks the target animation time
SliderAnimator.prototype.update = function(delta)
{	
	if (this.state == "Animating Sliders")
	{
        var allFinished = true;
		for (var i = 0; i < this.instructions.length; i++)
		{
			var instruction = this.instructions[i];
			if (instruction.finished)
				continue
			
			var allFinished = false;
			
			var deltaValue = delta * instruction.changePerSecond;
			var increment =  Math.round(deltaValue / Number(instruction.slider.step)) * instruction.slider.step;

			if (increment == 0)
			{
				if (instruction.changePerSecond > 0)
					increment = Number(instruction.slider.step);
				else
					increment = -Number(instruction.slider.step);
			}
			
			instruction.slider.value = Number(instruction.slider.value) + increment;


			if (instruction.changePerSecond >= 0 && instruction.slider.value >= instruction.target)
			{
				instruction.slider.value = instruction.target;
				instruction.finished = true;
			}
			else if (instruction.changePerSecond <= 0 && instruction.slider.value <= instruction.target)
			{
				instruction.slider.value = instruction.target;
				instruction.finished = true;
			}
			
			instruction.slider.oninput();
		}
		
		if (allFinished)
		{
			this.state = "Rolled";
			this.controls.enableForms(false);
		}
			
	}
    else if (this.state == "Animating Stretching" || this.state == "Animating Unstretching" )
    {

        var allFinished = true;
        
        var newPositions = [];
        for (var i = 0; i < this.instructions.length; i++)
        {
            var instruction = this.instructions[i];
            if (instruction.finished)
                continue
            
            var allFinished = false;
            
            var deltaValue = delta * instruction.changePerSecond;
            var increment =  Math.round(deltaValue / instruction.step) * instruction.step;

            if (increment == 0)
            {
                if (instruction.changePerSecond > 0)
                    increment = instruction.step;
                else
                    increment = -instruction.step;
            }
            
            var newPosition = Number(instruction.circle.getAttribute('cy')) + increment;

            if (instruction.changePerSecond >= 0 && Number(instruction.circle.getAttribute('cy')) >= instruction.target)
            {
                newPosition = instruction.target;
                instruction.finished = true;
            }
            else if (instruction.changePerSecond <= 0 && Number(instruction.circle.getAttribute('cy')) <= instruction.target)
            {
                newPosition = instruction.target;
                instruction.finished = true;
            }
            
            instruction.circle.setAttribute("cy", newPosition);
            this.stretchWidget.circles[i].y = newPosition;
        }
        
        this.stretchWidget.scaleSurface();
        
        if (allFinished)
        {
            if (this.state == "Animating Stretching")
            {
                this.state = "Stretched";
                this.surface.setStretched(true);
            }
            else if (this.state == "Animating Unstretching")
            {
                this.state = "Flattened";
                this.surface.setStretched(false);
            }
        }
    }            
}
