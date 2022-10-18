import torch
import torch.nn as nn

import DCGAN_VAE_pixel as DVAE

network = 'G'
nz = 100
nc = 1
ngf = 32
ngpu = 1
image_size = 32

def skyline_model_provider():
    if network == 'G':
        net = DVAE.DCGAN_G(image_size, nz, nc, ngf, ngpu)
    elif network == 'E':
        net = DVAE.Encoder(image_size, nz, nc, ngf, ngpu)
    
    return net.cuda()


def skyline_input_provider(batch_size=128):
    """
    target torch.Size([131072])
    going into E torch.Size([128, 1, 32, 32])
    E -> G torch.Size([128, 100, 1, 1])
    G output torch.Size([128, 1, 32, 32, 256])
    """
    image_shape = None
    output_shape = None
    if network == "E":
        input_shape = (batch_size, 1, image_size, image_size)
        output_shape = (batch_size, nz, 1, 1)
    elif network == "G":
        input_shape = (batch_size, nz, 1, 1)
        output_shape = (batch_size, 1, image_size, image_size, 256)

    return (
        torch.randn(input_shape).cuda(),
        torch.randint(low=0, high=1000, size=output_shape).cuda(),
    )

def skyline_iteration_provider(model):
    optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)
    def iteration(*inputs):
        optimizer.zero_grad()
        out = model(*inputs)
        out.backward()
        optimizer.step()
    return iteration

if __name__ == '__main__':
    if False:
        import habitat

        tracker = habitat.OperationTracker(
            device=habitat.Device.RTX2070,
        )

        model = skyline_model_provider()
        iteration = skyline_iteration_provider(model)
        X, y = skyline_input_provider()

        with tracker.track():
            iteration(X)

        trace = tracker.get_tracked_trace()

        devices = [
            habitat.Device.P4000,
            habitat.Device.GTX1080Ti,
            habitat.Device.RTX2070,
            habitat.Device.RTX2080Ti,
            habitat.Device.P4,
            habitat.Device.T4,
            habitat.Device.V100,
            habitat.Device.P100,
        ]

        for d in devices:
            print(d, trace.to_device(d).run_time_ms)
